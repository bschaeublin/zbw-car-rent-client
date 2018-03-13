import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatSelectModule, MatSidenavModule, MatSnackBarModule,
  MatTableModule, MatTabsModule, MatToolbarModule
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
    MatTabsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatNativeDateModule,
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
    MatNativeDateModule,
    MatTabsModule,
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
