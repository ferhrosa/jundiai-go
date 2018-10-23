import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MapComponent } from './map/map.component';
import { VisitedComponent } from './visited/visited.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    VisitedComponent,
  ],
  imports: [
    BrowserModule, FormsModule,
    AppRoutingModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
