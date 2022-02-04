import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent implements OnInit {
  title: string;
  content: string;
  closeLabel: string = 'Close';

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.title) this.title = this.data.title;
    this.content = this.data.content;
    if (this.data.closeLabel) this.closeLabel = this.data.closeLabel;
  }

  onClose() {
    this.dialogRef.close();
    this.data.onCloseHandler && this.data.onCloseHandler();
  }
}
