import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

const container = 'map';

const maxBoundaries = new mapboxgl.LngLatBounds([-47.051, -23.345], [-46.765, -23.055]);

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

    userPositionSource: mapboxgl.GeoJSONSource;

    constructor() { }

    ngOnInit() {
        if (this.hasRequestedMapPermission) { this.initializeMap(); }
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
            zoom: 17,
            maxZoom: 18,
            maxBounds: maxBoundaries,
            center: [this.lng, this.lat],
            logoPosition: 'top-left',
            // dragPan: false,
        });

        this.map.on('load', () => {

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

            this.map.addSource('user-position', {
                type: 'geojson',
                data: this.getUserPosition(),
            });

            this.userPositionSource = <mapboxgl.GeoJSONSource>this.map.getSource('user-position');

            this.map.addLayer({
                id: 'user',
                type: 'symbol',
                source: 'user-position',
                layout: {
                    'icon-image': 'rocket-15',
                },
            });

        });
    }

    updateCurrentPosition(position: Position) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        if (this.userPositionSource) {
            this.userPositionSource.setData(this.getUserPosition());
        }

        this.map.panTo([this.lng, this.lat]);
    }
}
