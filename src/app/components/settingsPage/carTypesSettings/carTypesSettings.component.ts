import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CarClass, CarType} from '../../../model';
import {SettingsService, ValidationService} from '../../../services';

@Component({
  selector: 'app-car-types-settings',
  templateUrl: './carTypesSettings.component.html',
  styleUrls: ['./carTypesSettings.component.scss']
})
export class CarTypesSettingsComponent implements OnInit {
  public carTypes: CarType[];
  public carClasses: CarClass[];

  public newCarTypeForm: FormGroup = new FormGroup({
    'id': new FormControl(null, []),
    'title': new FormControl(null, [Validators.required]),
  });
  constructor(private _settingsService: SettingsService,
              private _dialog: MatDialog,
              private _validator: ValidationService,
              private _snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._resetTypes();
    this._resetClasses();
  }

  private _resetTypes(): void {
    this._settingsService.getTypes().subscribe(t => this.carTypes = t);
  }

  private _resetClasses(): void {
    this._settingsService.getClasses().subscribe(c => this.carClasses = c);
  }

  public removeType(b: CarType): void {
    this._settingsService.removeType(b).subscribe(success => {
      this._resetTypes();
      this._snackBar.open('removed type: ' + b.title, null, { duration: 3000 });
    });
  }

  public addType(): void {
    if (this.newCarTypeForm.valid) {
      console.log(this.newCarTypeForm.value);
      const type = new CarType();
      type.title = this.newCarTypeForm.value.title;

      this._settingsService.addType(type).subscribe(newType => {
        this._resetTypes();
        this._snackBar.open('added brand: ' + newType.title, null, { duration: 3000 });
      });
    } else {
      this._validator.validateAllFormFields(this.newCarTypeForm);
    }
  }

  public toggleEdit(b: CarType): void {
    b.edit = true;
  }

  public updateBrand(b: CarType): void {
    this._settingsService.updateType(b).subscribe(() => {
      this._resetTypes();
      this._snackBar.open('updated brand: ' + b.title, null, { duration: 3000 });
    });
  }

}
