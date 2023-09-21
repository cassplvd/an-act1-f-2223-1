import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../window/Itabs';


@Component({
  selector: 'app-excluir-dialog',
  templateUrl: './excluir-dialog.component.html',
  styleUrls: ['./excluir-dialog.component.scss']
})
export class ExcluirDialogComponent {


  constructor(public dialogRef: MatDialogRef<ExcluirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onOkClick(): void {
    this.dialogRef.close("ok");
  }

  onNoClick(): void {
    this.dialogRef.close("no");
  }

}
