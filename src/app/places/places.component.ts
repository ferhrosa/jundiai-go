import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { collections } from '../shared/collections';
import { Place } from '../shared/place.model';
import { Entity } from '../shared/entity.model';
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent {

  places: Observable<Place[]>;

  currentPlace = new Place();

  constructor(private db: AngularFirestore) {
    this.places = Entity.getList(db, collections.places,
      ref => ref.orderBy('name'));
  }

  editPlace(place: Place): void {
    this.currentPlace = new Place();
    Object.assign(this.currentPlace, place);
  }

  cancelEdit(): void {
    this.currentPlace = new Place();
  }

  savePlace(): void {
    const toSave = Entity.toSaveable(this.currentPlace);

    if (this.currentPlace.id) {
      this.db.doc<Place>(`${collections.places}/${this.currentPlace.id}`)
        .update(toSave);
    } else {
      this.db.collection(collections.places)
        .add(toSave);
    }

    this.currentPlace = new Place();
  }

  deletePlace(): void {
    if (confirm('Tem certeza de que deseja excluir esse local?')) {
      this.db.doc<Place>(`${collections.places}/${this.currentPlace.id}`)
        .delete();

      this.currentPlace = new Place();
    }
  }


}
