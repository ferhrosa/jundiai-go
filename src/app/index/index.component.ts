import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

const container = 'map';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lat = 37.75;
    lng = -122.41;

    constructor() { }

    ngOnInit() {
        this.buildMap();
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
