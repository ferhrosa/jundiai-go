import { Component } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { tokens } from './../environments/tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    // Initialize the Mapbox access token. It is not being directly set because of errors on TS typing.
    Object.assign(mapboxgl, { accessToken: tokens.mapbox });
  }

}
