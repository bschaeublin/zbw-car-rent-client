import {Component, OnInit} from '@angular/core';
import {CarService, CustomerService, ReservationService, SettingsService, ValidationService} from '../../services';
import {Car, CarBrand, CarClass, Customer, Reservation, ReservationState} from '../../model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import 'rxjs/add/observable/forkJoin';
import moment = require("moment");

@Component({
  selector: 'app-new-car-dialog',
  templateUrl: './newReservationDialog.component.html',
  styleUrls: ['./newReservationDialog.component.scss']
})
export class NewReservationDialogComponent implements OnInit {
  public carClasses: CarClass[];
  public carBrands: CarBrand[];
  public customers: Customer[];

  public cars: Car[];
  public filteredClasses: Observable<CarClass[]>;
  public filteredCustomers: Observable<Customer[]>;
  /*
  *
  * public carId: number;
    public customerId: number;
    public days: number;
    public state: ReservationState;
    public rentalDate: string;
    public reservationDate: string;
  */

  public carsControl = new FormControl(null, [Validators.required]);
  public newReservationForm: FormGroup = new FormGroup({
    'carId': this.carsControl,
    'customerId': new FormControl(null, [Validators.required]),
    'classId': new FormControl(null, [Validators.required]),
    'days': new FormControl(null, [Validators.required]),
    'rentalDate': new FormControl(null, [Validators.required]),
  });

  constructor(private _carsService: CarService,
              private _customerService: CustomerService,
              private _reservationService: ReservationService,
              private _settingsService: SettingsService,
              private _dialogRef: MatDialogRef<NewReservationDialogComponent>,
              private _validator: ValidationService) {
  }

  public async ngOnInit() {
      this.carsControl.disable();
      this._settingsService.getSettings().subscribe(s => {
        this.carBrands = s.carBrands;
        this.carClasses = s.carClasses;
        this._customerService.getCustomers().subscribe(customers => {
          this.customers = customers;
          this.filteredCustomers = this.newReservationForm.controls['customerId'].valueChanges
            .pipe(
              startWith(''),
              map(c => c ? this.filterCustomers(c) : this.customers.slice())
            );
        });
        this._carsService.getCars().subscribe(cars => {
          this.cars = cars;
          this.filteredClasses = this.newReservationForm.controls['classId'].valueChanges
            .pipe(
              startWith(''),
              map(c => c ? this.filterClasses(c) : this.carClasses.slice())
            );
          this.newReservationForm.controls['classId'].valueChanges.subscribe((val: CarClass) => {
              const enabled = val && val.id;
              if (enabled) {
                this.carsControl.enable();
              } else {
                this.carsControl.disable();
              }
          });
        });
      });
  }

  public onSubmit(): void {
    if (this.newReservationForm.valid) {
      const newReservationForm = this.newReservationForm.value;
      delete newReservationForm.classId;
      const newReservation = newReservationForm as Reservation;
      newReservation.carId = newReservationForm.carId.id;

      newReservation.customerId = newReservationForm.customerId.id;
      newReservation.reservationDate = moment().utc().toString();
      newReservation.state = ReservationState.Pending;
      console.log(newReservation);
      this._reservationService.addReservation(newReservation).subscribe(result => { this._dialogRef.close(result); });
    } else {
      console.log('validating');
      this._validator.validateAllFormFields(this.newReservationForm);
    }
  }

  public filteredCars(): Car[] {
    const cls = this.newReservationForm.controls['classId'].value as CarClass;
    if (cls && cls.id !== 0) {
      return this.cars.filter(c => c.classId === cls.id);
    }
    return this.cars;
  }

  public onCancel(): void {
    this._dialogRef.close(null);
  }

 public filterBrands(brand: any) {
    return brand instanceof String ? this.carBrands.filter(b =>
      b.title.toLowerCase().indexOf(brand.toLowerCase()) === 0) : this.carBrands;
  }

  public filterCustomers(c: any): Customer[] {
    return c instanceof String ? this.customers.filter(cu =>
      (cu.firstName.toLowerCase() + ' ' + cu.lastName.toLowerCase()).indexOf(c.toLowerCase()) === 0) : this.customers;
  }

  public filterClasses(c: any): CarClass[] {
    return c instanceof String ? this.carClasses.filter(cls =>
      cls.title.toLowerCase().indexOf(c.toLowerCase()) === 0) : this.carClasses;
  }

  public displayFn(obj: any) {
    return obj ? obj.title : '';
  }

  public displayCar(obj: Car) {
    return obj ? obj.brandId + ' ' + obj.registrationYear : '';
  }

  public displayCustomer(obj: Customer) {
    return obj ? obj.firstName + ' ' + obj.lastName : '';
  }
}
