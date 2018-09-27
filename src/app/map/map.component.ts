import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

const container = 'map';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    hasRequestedMapPermission = Boolean(localStorage.getItem('hasRequestedMapPermission'));
    hasMapPermission: boolean = null;

    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lat: number = null;
    lng: number = null;

    constructor() { }

    ngOnInit() {
        if (this.hasRequestedMapPermission) { this.initializeMap(); }
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
                },
                error => {
                    if (error.code === error.PERMISSION_DENIED) {
                        this.hasMapPermission = false;
                        this.hasRequestedMapPermission = true;
                        localStorage.setItem('hasRequestedMapPermission', 'true');
                        // alert('A permissão para ver sua localização atual foi negada. Não será possível exibir o mapa.');
                    }
                }
            );
        }
    }
    buildMap() {
        this.map = new mapboxgl.Map({
            container: container,
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        });
    }

}
