import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Place } from '../shared/place.model';

@Component({
  selector: 'app-place-dialog',
  templateUrl: './place-dialog.component.html',
  styleUrls: ['./place-dialog.component.scss']
})
export class PlaceDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PlaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public place: Place) { }

  close() {
    this.dialogRef.close();
  }

}
