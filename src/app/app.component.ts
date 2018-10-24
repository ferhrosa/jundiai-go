import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import * as mapboxgl from 'mapbox-gl';
import { tokens } from './../environments/tokens';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentPage: string;

  constructor(private router: Router) {
    // Initialize the Mapbox access token. It is not being directly set because of errors on TS typing.
    Object.assign(mapboxgl, { accessToken: tokens.mapbox });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.url.replace('/', '');
      }
    });
  }

}
