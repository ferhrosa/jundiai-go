import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

import { tokens } from 'src/environments/tokens';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapComponent } from './map/map.component';
import { VisitedComponent } from './visited/visited.component';
import { PlacesComponent } from './places/places.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    VisitedComponent,
    PlacesComponent,
  ],
  imports: [
    BrowserModule, FormsModule,
    AngularFireModule.initializeApp(tokens.firebase),
    AngularFirestoreModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
      MatFormFieldModule, MatListModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
