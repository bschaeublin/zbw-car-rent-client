import {Component, OnChanges, OnInit} from '@angular/core';
import {
  BreadCrumbService, CarService, CustomerService, SettingsService, UnicornService,
  ValidationService
} from '../../services';
import {BreadCrumb, Car, CarBrand, CarClass, CarType, Customer} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-car-detail-page',
  templateUrl: './carDetailPage.component.html',
  styleUrls: ['./carDetailPage.component.scss']
})
export class CarDetailPageComponent implements OnInit, OnChanges {
  public car: Car;
  public carTypes: CarType[];
  public carClasses: CarClass[];
  public carBrands: CarBrand[];

  public filteredTypes: Observable<CarType[]>;
  public filteredClasses: Observable<CarClass[]>;
  public filteredBrands: Observable<CarBrand[]>;

  public carDetailForm: FormGroup = new FormGroup({
    'brandId': new FormControl(null, [Validators.required]),
    'typeId': new FormControl(null, [Validators.required]),
    'classId': new FormControl(null, [Validators.required]),
    'kilometers': new FormControl(null, [Validators.required]),
    'horsePower': new FormControl(null, [Validators.required]),
    'registrationYear': new FormControl(null, [Validators.required, Validators.maxLength(4)]),
  });
  constructor(private _carService: CarService,
              private _dialog: MatDialog,
              private _settingsService: SettingsService,
              private _validator: ValidationService,
              private _router: Router,
              private _snackBar: MatSnackBar,
              private _crs: BreadCrumbService,
              private _route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this._route.params.subscribe((p) => {
      if (p.id) {
        this._settingsService.getSettings().subscribe(s => {
          console.log('settings', s);
          this.carBrands = s.carBrands;
          this.carTypes = s.carTypes;
          this.carClasses = s.carClasses;

          this.filteredBrands = this.carDetailForm.controls['brandId'].valueChanges
            .pipe(
              startWith(''),
              map(b => b ? this.filterBrands(b) : this.carBrands.slice())
            );

          this.filteredTypes = this.carDetailForm.controls['typeId'].valueChanges
            .pipe(
              startWith(''),
              map(t => t ? this.filterTypes(t) : this.carTypes.slice())
            );

          this.filteredClasses = this.carDetailForm.controls['classId'].valueChanges
            .pipe(
              startWith(''),
              map(c => c ? this.filterClasses(c) : this.carClasses.slice())
            );

          this._reload(p.id);
        });
      }
    });
  }

  private _reload(id: number): void {
    console.log('reload');
    console.log('not-reload-brands', this.carBrands);
    this._carService.getCar(id).subscribe(c => {
      console.log('loaded car', c);
      this.car = c;
      console.log('reload-brands', this.carBrands);
      this.reset();
      console.log('reset-brands', this.carBrands);
      this._crs.buildBreadCrumb([
        new BreadCrumb('/customers', 'Home'),
        new BreadCrumb('/cars', 'Cars'),
        new BreadCrumb('/cars/' + c.id, this.displayCar(c))]);
    });
  }

  public ngOnChanges(changes: any): void {
    console.log(changes);
  }

  public removeCar(c: Car): void {
    this._carService.removeCar(c).subscribe(success => {
      this._router.navigate(['/cars']);
    });
  }

  public reset(): void {
    console.log('reset', this.car);
    this.carDetailForm.controls['brandId'].disable();

    const carValue = Object.assign({}, this.car as any);
    carValue.classId = this.carClasses.filter(c => c.id === this.car.classId)[0];
    carValue.typeId = this.carTypes.filter(t => t.id === this.car.typeId)[0];
    carValue.brandId = this.carTypes.filter(t => t.id === this.car.brandId)[0];

    this.carDetailForm.reset(carValue, { onlySelf: true });
  }

  public filterBrands(brand: any) {
    return brand instanceof String ? this.carBrands.filter(b =>
      b.title.toLowerCase().indexOf(brand.toLowerCase()) === 0) : this.carBrands;
  }

  public filterTypes(type: any) {
    return type instanceof String ? this.carTypes.filter(t =>
      t.title.toLowerCase().indexOf(type.toLowerCase()) === 0) : this.carTypes;
  }

  public filterClasses(c: any): CarClass[] {
    return c instanceof String ? this.carClasses.filter(cls =>
      cls.title.toLowerCase().indexOf(c.toLowerCase()) === 0) : this.carClasses;
  }

  public displayBrand(obj: any): string {
    console.log('brands', this.carBrands);
    if (!this.car) {
      return '';
    }
    const id = (obj && obj.id) ? obj.id : obj;
    const brand = this.carBrands.filter(b => b.id === id)[0];
    return this.displayFn(brand);
  }

  public displayType(obj: any) {
    console.log('types', this.carTypes);
    if (!this.car) {
      return '';
    }
    console.log('type', obj);

    const id = (obj && obj.id) ? obj.id : obj;
    const type = this.carTypes.filter(t => t.id === id)[0];
    return this.displayFn(type);
  }

  public displayClass(obj: any) {
    console.log('classes', this.carClasses);
    if (!this.car) {
      return '';
    }
    console.log('cls', obj);
    const id = (obj && obj.id) ? obj.id : obj;
    const cls = this.carClasses.filter(c => c.id === id)[0];
    return this.displayFn(cls);
  }

  public displayFn(obj: any) {
    console.log(obj);
    return obj ? obj.title : '';
  }

  public displayCar(obj: Car) {
    const brand = this.carBrands.filter(b => b.id === obj.brandId)[0];
    return this.displayFn(brand) + ' (' +  this.car.registrationYear + ')';
  }

  public update(): void {
    if (this.carDetailForm.valid) {
      const newCarFormValue = this.carDetailForm.value;
      const newCar = newCarFormValue as Car;
      console.log('newCarFormValue', newCarFormValue);
      newCar.classId = newCarFormValue.classId.id;
      newCar.typeId = newCarFormValue.typeId.id;
      newCar.brandId = this.car.brandId;
      newCar.id = this.car.id;

      this._carService.updateCar(newCar).subscribe(() => {
        this._reload(this.car.id);
        this._snackBar.open('updated car: ' + this.displayCar(this.car), null, { duration: 3000 });
      });
    } else {
      this._validator.validateAllFormFields(this.carDetailForm);
    }
  }
}
