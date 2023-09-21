import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './change-dialog.component.html',
  styleUrls: ['./change-dialog.component.scss']
})
export class DialogAnimationsExampleDialog {

  myColor: string = 'rgb(118, 193, 255)';

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) { }

  onOkClick(): void {
    this.dialogRef.close("ok");
  }

  onNoClick(): void {
    this.dialogRef.close("no");
  }

}
