import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Place } from '../shared/place.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Entity } from '../shared/entity.model';
import { collections } from '../shared/collections';
import { MatDialog } from '@angular/material';
import { PlaceDialogComponent } from '../place-dialog/place-dialog.component';

@Component({
  selector: 'app-visited',
  templateUrl: './visited.component.html',
  styleUrls: ['./visited.component.scss']
})
export class VisitedComponent {

  places: Place[];

  constructor(
    public dialog: MatDialog,
  ) {
    this.places = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
  }

  showPlace(place: Place) {
    this.dialog.open(PlaceDialogComponent, {
        data: place,
    });
  }

}
