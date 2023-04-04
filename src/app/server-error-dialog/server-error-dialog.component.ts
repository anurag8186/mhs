import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-server-error-dialog',
  templateUrl: './server-error-dialog.component.html',
  styleUrls: ['./server-error-dialog.component.css']
})
export class ServerErrorDialogComponent implements OnInit {
  title!: string;
  message!: string;
  actionButton!: boolean;
  constructor(public dialogRef: MatDialogRef<ServerErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
    this.actionButton = data.actionButton;
  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string, public actionButton: boolean) {
  }
}
