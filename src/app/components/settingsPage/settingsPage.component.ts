import {Component, OnInit} from '@angular/core';
import {SettingsService, ValidationService} from '../../services';
import {CarBrand, CarClass, CarType, Customer} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settingsPage.component.html',
  styleUrls: ['./settingsPage.component.scss']
})
export class SettingsPageComponent implements OnInit {
  public carBrands: CarBrand[];
  public carTypes: CarType[];
  public carClasses: CarClass[];

  public newCarBrandsForm: FormGroup = new FormGroup({
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
    this._resetBrands();
    this._resetTypes();
    this._resetClasses();
  }

  private _resetBrands(): void {
    this._settingsService.getBrands().subscribe(b => this.carBrands = b);
  }

  private _resetTypes(): void {
    this._settingsService.getTypes().subscribe(t => this.carTypes = t);
  }

  private _resetClasses(): void {
    this._settingsService.getClasses().subscribe(c => this.carClasses = c);
  }

  public removeBrand(b: CarBrand): void {
    this._settingsService.removeBrand(b).subscribe(success => {
      this._resetBrands();
      this._snackBar.open('removed brand: ' + b.title, null, { duration: 3000 });
    });
  }

  public addBrand(): void {
    if (this.newCarBrandsForm.valid) {
      console.log(this.newCarBrandsForm.value);
      const brand = new CarBrand();
      brand.title = this.newCarBrandsForm.value.title;

      this._settingsService.addBrand(brand).subscribe(newBrand => {
        this._resetBrands();
        this._snackBar.open('added brand: ' + newBrand.title, null, { duration: 3000 });
      });
    } else {
      this._validator.validateAllFormFields(this.newCarBrandsForm);
    }
  }

  public updateBrand(b: CarBrand): void {
    this._settingsService.updateBrand(b).subscribe(() => {
      this._resetBrands();
      this._snackBar.open('updated brand: ' + b.title, null, { duration: 3000 });
    });
  }

}
