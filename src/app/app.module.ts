import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material';

import { tokens } from 'src/environments/tokens';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapComponent } from './map/map.component';
import { VisitedComponent } from './visited/visited.component';
import { PlacesComponent } from './places/places.component';
import { PlaceDialogComponent } from './place-dialog/place-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    VisitedComponent,
    PlacesComponent,
    PlaceDialogComponent,
  ],
  entryComponents: [
    PlaceDialogComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    AngularFireModule.initializeApp(tokens.firebase),
    AngularFirestoreModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatListModule, MatCardModule,
    MatDialogModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
