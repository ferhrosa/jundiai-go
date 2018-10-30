import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { AngularFirestore } from '@angular/fire/firestore';

import * as mapboxgl from 'mapbox-gl';
import { Entity } from '../shared/entity.model';
import { Observable } from 'rxjs';
import { Place } from '../shared/place.model';
import { collections } from '../shared/collections';
import { Feature, Geometry } from 'geojson';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PlaceDialogComponent } from '../place-dialog/place-dialog.component';
import { storage } from 'firebase';

const container = 'map';
const initialZoom = 17;
const initialUserScale = 0.75;
const minUserScale = 0.25;
const maxDistanceToDisplayPlaces = 2000;

// const maxBoundaries = new mapboxgl.LngLatBounds([-47.051, -23.345], [-46.765, -23.055]);

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    hasRequestedMapPermission = Boolean(localStorage.getItem('hasRequestedMapPermission'));
    hasMapPermission: boolean = null;
    hasBuildedMap = false;

    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/streets-v9';
    lat: number = null;
    lng: number = null;

    // zoom: number;
    // bounds: mapboxgl.LngLatBounds;

    // userPositionSource: mapboxgl.GeoJSONSource;

    userTransform: SafeStyle = 'scale(0)';
    isUserWalking = false;
    isUserFacingLeft = false;

    placesObservable: Observable<Place[]>;
    placesSource: mapboxgl.GeoJSONSource;
    places: Place[] = [];
    nearPlaces: Place[] = [];
    visitedPlaces: Place[];

    constructor(
        private db: AngularFirestore,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog) { }

    ngOnInit() {
        if (this.hasRequestedMapPermission) { this.initializeMap(); }

        this.placesObservable = Entity.getList(this.db, collections.places);

        this.visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
    }

    getUserPosition = (): GeoJSON.Feature<GeoJSON.Geometry> => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [this.lng, this.lat],
            },
            properties: null,
        };
    }

    initializeMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;

                    this.hasMapPermission = true;
                    this.hasRequestedMapPermission = true;
                    localStorage.setItem('hasRequestedMapPermission', 'true');

                    this.buildMap();

                    navigator.geolocation.watchPosition(p => this.updateCurrentPosition(p));

                    this.updateNearPlaces();
                },
                error => {
                    if (error.code === error.PERMISSION_DENIED) {
                        this.hasMapPermission = false;
                        this.hasRequestedMapPermission = true;
                        localStorage.setItem('hasRequestedMapPermission', 'true');
                    }
                }
            );
        }
    }

    buildMap() {
        this.hasBuildedMap = true;

        this.map = new mapboxgl.Map({
            container: container,
            style: this.style,
            zoom: initialZoom,
            maxZoom: 18,
            minZoom: 12,
            // maxBounds: maxBoundaries,
            center: [this.lng, this.lat],
            pitch: 30,
            logoPosition: 'top-left',
            dragPan: false,
            scrollZoom: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
            boxZoom: false,
        });

        this.map.on('load', () => {

            this.updateUserTransform();

            this.map.addSource('jundiai', {
                type: 'geojson',
                data: './assets/Jundiaí_AL8.GeoJson',
            });

            this.map.addLayer({
                id: 'jundiai-line',
                type: 'line',
                source: 'jundiai',
                paint: {
                    'line-color': '#01579B',
                    'line-width': 2,
                },
            });

            this.map.addSource('places', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            });

            this.placesSource = this.map.getSource('places') as mapboxgl.GeoJSONSource;

            // Updates the places list when it's loaded (or when it's changed on Firebase).
            this.placesObservable.subscribe(places => {
                this.placesSource.setData(<GeoJSON.FeatureCollection<GeoJSON.Geometry>>{
                    type: 'FeatureCollection',
                    features: places.map<Feature<Geometry>>(place => <Feature<Geometry>>{
                        type: 'Feature',
                        id: place.id,
                        geometry: {
                            type: 'Point',
                            coordinates: [place.longitude, place.latitude],
                        },
                        properties: {
                            name: place.name,
                        },
                    }),
                });

                this.places.splice(0, this.places.length);
                _.each(places, place => this.places.push(place));

                this.updateNearPlaces();
            });

            // Create the layer to display the places on the map.
            this.map.addLayer({
                id: 'places',
                source: 'places',
                type: 'symbol',
                layout: {
                    'icon-image': 'town-hall-15',
                    'icon-size': 2,
                    'text-field': '{name}',
                    'text-size': 15,
                    'text-offset': [0, 2],
                },
                paint: {
                    'text-color': '#01579b',
                    'text-halo-color': '#fff',
                    'text-halo-width': 2,
                },
            });
        });

        this.map.on('zoom', this.updateUserTransform);

        this.map.on('movestart', () => this.isUserWalking = true);
        this.map.on('moveend', () => this.isUserWalking = false);
    }

    updateCurrentPosition(position: Position) {
        if (position.coords.longitude !== this.lng) {
            this.isUserFacingLeft = (position.coords.longitude < this.lng);
        }

        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.map.flyTo({
            center: [this.lng, this.lat],
            speed: 0.25,
            curve: 2,
        });

        this.updateNearPlaces();
    }

    updateUserTransform = () => {
        const relativeZoom = initialZoom - this.map.getZoom();

        let scale = initialUserScale - (relativeZoom / 5);
        if (scale < minUserScale) { scale = minUserScale; }

        const rotate = this.isUserFacingLeft ? 'rotateY(180deg)' : '';

        this.userTransform = this.sanitizer.bypassSecurityTrustStyle(`scale(${scale}) ${rotate}`);
    }

    updateNearPlaces() {
        this.nearPlaces.splice(0, this.nearPlaces.length);

        _(this.places)
            .filter(place => this.calculateDistance(place) <= maxDistanceToDisplayPlaces)
            .orderBy(place => this.calculateDistance(place))
            .orderBy(place => this.isVisitedPlace(place))
            .each(place => this.nearPlaces.push(place));
    }

    showPlace(place: Place) {
        this.dialog.open(PlaceDialogComponent, {
            data: place,
        });

        this.visitedPlaces.push(place);
        localStorage.setItem('visitedPlaces', JSON.stringify(this.visitedPlaces));

        this.updateNearPlaces();
    }

    isVisitedPlace(place: Place) {
        return _.some(this.visitedPlaces, vp => vp.id === place.id);
    }

    calculateDistance(place: Place): number {
        const R = 6371e3; // metres
        const φ1 = this.toRadians(this.lat);
        const φ2 = this.toRadians(place.latitude);
        const Δφ = this.toRadians(place.latitude - this.lat);
        const Δλ = this.toRadians(place.longitude - this.lng);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    getFormattedDistance(place: Place): string {
        let distance = this.calculateDistance(place);
        let unit = 'm';

        if (distance >= 1000) {
            distance = distance / 1000;
            unit = 'km';
        }

        return `${distance.toFixed(1).replace('.', ',')}${unit}`;
    }

    private toRadians = (n: number): number => n * Math.PI / 180;
}
