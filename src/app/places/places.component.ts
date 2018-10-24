import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { collections } from '../shared/collections';
import { Place } from '../shared/place.model';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  places: Observable<Place[]>;

  currentPlace = new Place();

  constructor(private db: AngularFirestore) {
    this.places = db.collection<Place>(collections.places).valueChanges();
  }

  ngOnInit() {
  }

  addPlace() {
    this.db.collection(collections.places).add(this.currentPlace);
  }

}
