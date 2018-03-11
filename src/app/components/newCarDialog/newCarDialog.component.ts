import {Component, OnInit} from '@angular/core';
import {CarService, SettingsService, ValidationService} from '../../services';
import {Car, CarBrand, CarClass, CarType} from '../../model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-new-car-dialog',
  templateUrl: './newCarDialog.component.html',
  styleUrls: ['./newCarDialog.component.scss']
})
export class NewCarDialogComponent implements OnInit {
  public carTypes: CarType[];
  public carClasses: CarClass[];
  public carBrands: CarBrand[];

  public filteredTypes: Observable<CarType[]>;
  public filteredClasses: Observable<CarClass[]>;
  public filteredBrands: Observable<CarBrand[]>;

  public newCarForm: FormGroup = new FormGroup({
    'brandId': new FormControl(null, [Validators.required]),
    'typeId': new FormControl(null, [Validators.required]),
    'classId': new FormControl(null, [Validators.required]),
    'kilometers': new FormControl(null, [Validators.required]),
    'horsePower': new FormControl(null, [Validators.required]),
    'registrationYear': new FormControl(null, [Validators.required, Validators.maxLength(4)]),
  });

  constructor(private _carsService: CarService,
              private _settingsService: SettingsService,
              private _dialogRef: MatDialogRef<NewCarDialogComponent>,
              private _validator: ValidationService) {
  }

  public async ngOnInit() {
      this._settingsService.getSettings().subscribe(s => {
        this.carBrands = s.carBrands;
        this.carTypes = s.carTypes;
        this.carClasses = s.carClasses;

        this.filteredBrands = this.newCarForm.controls['brandId'].valueChanges
          .pipe(
            startWith(''),
            map(b => b ? this.filterBrands(b) : this.carBrands.slice())
          );

        this.filteredTypes = this.newCarForm.controls['typeId'].valueChanges
          .pipe(
            startWith(''),
            map(t => t ? this.filterTypes(t) : this.carTypes.slice())
          );

        this.filteredClasses = this.newCarForm.controls['classId'].valueChanges
          .pipe(
            startWith(''),
            map(c => c ? this.filterClasses(c) : this.carClasses.slice())
          );
      });
  }

  public onSubmit(): void {
    if (this.newCarForm.valid) {
      const newCarFormValue = this.newCarForm.value;
      const newCar = newCarFormValue as Car;
      newCar.classId = newCarFormValue.classId.id;
      newCar.brandId = newCarFormValue.brandId.id;
      newCar.typeId = newCarFormValue.typeId.id;
      this._carsService.addCar(newCar).subscribe(result => { this._dialogRef.close(result); });
    } else {
      console.log('validating');
      this._validator.validateAllFormFields(this.newCarForm);
    }
  }

  public onCancel(): void {
    this._dialogRef.close(null);
  }

 public filterBrands(brand: any) {
    return brand instanceof String ? this.carBrands.filter(b =>
      b.title.toLowerCase().indexOf(brand.toLowerCase()) === 0) : this.carBrands;
  }

  public filterTypes(t: any) {
    return t instanceof String ? this.carTypes.filter(type =>
      type.title.toLowerCase().indexOf(t.toLowerCase()) === 0) : this.carTypes;
  }

  public filterClasses(c: any): CarClass[] {
    return c instanceof String ? this.carClasses.filter(cls =>
      cls.title.toLowerCase().indexOf(c.toLowerCase()) === 0) : this.carClasses;
  }

  public displayFn(obj: any) {
    return obj ? obj.title : '';
  }
}
