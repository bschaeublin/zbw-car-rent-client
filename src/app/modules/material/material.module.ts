import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatSelectModule, MatSidenavModule, MatSnackBarModule,
  MatTableModule, MatToolbarModule
} from '@angular/material';



@NgModule({
  imports: [
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
  ]
})
export class MaterialModule { }
