import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CarBrand} from '../../../model';
import {SettingsService, ValidationService} from '../../../services';

@Component({
  selector: 'app-car-brand-settings',
  templateUrl: './carBrandSettings.component.html',
  styleUrls: ['./carBrandSettings.component.scss']
})
export class CarBrandSettingsComponent implements OnInit {
  public carBrands: CarBrand[];

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
  }

  private _resetBrands(): void {
    this._settingsService.getBrands().subscribe(b => this.carBrands = b);
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

  public toggleEdit(b: CarBrand): void {
    b.edit = true;
  }

  public updateBrand(b: CarBrand): void {
    this._settingsService.updateBrand(b).subscribe(() => {
      this._resetBrands();
      this._snackBar.open('updated brand: ' + b.title, null, { duration: 3000 });
    });
  }

}
