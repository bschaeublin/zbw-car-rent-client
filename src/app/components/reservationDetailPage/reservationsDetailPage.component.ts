import {Component, OnChanges, OnInit} from '@angular/core';
import {
  BreadCrumbService, CarService, ContractService, CustomerService, ReservationService, SettingsService, UnicornService,
  ValidationService
} from '../../services';
import {BreadCrumb, Car, Customer, RentalContract, Reservation, ReservationState} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {CarSettings} from '../../model/carSettings';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-reservation-detail-page',
  templateUrl: 'reservationsDetailPage.component.html',
  styleUrls: ['./reservationsDetailPage.component.scss']
})
export class ReservationDetailPageComponent implements OnInit, OnChanges {
  public reservation: Reservation;
  public carSettings: CarSettings;
  public reservations: Reservation[];
  public customer: Customer;
  public cars: Car[];
  public filteredCars: Observable<Car[]>;
  public car: Car;

  public ReservationState = ReservationState;

  public reservationDetailForm: FormGroup = new FormGroup({
    'id': new FormControl(null, []),
    'carId': new FormControl(null, [Validators.required]),
    'customerId': new FormControl(null, [Validators.required]),
    'days': new FormControl(null, []),
    'state': new FormControl(null, []),
    'rentalDate': new FormControl(null, [Validators.required]),
    'reservationDate': new FormControl(null, [Validators.required ]),
  });
  constructor(private _reservationService: ReservationService,
              private _settingsService: SettingsService,
              private _carService: CarService,
              private _contractService: ContractService,
              private _validator: ValidationService,
              private _customerService: CustomerService,
              private _router: Router,
              private _crs: BreadCrumbService,
              private _snackBar: MatSnackBar,
              private _route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this._route.params.subscribe((p) => {
      if (p.id) {
        this._reload(p.id);
      }
    });
  }

  private _reload(id: number): void {
    this._reservationService.getReservation(id).subscribe(c => {
      this.reservation = c;
      this._crs.buildBreadCrumb([
        new BreadCrumb('/customers', 'Home'),
        new BreadCrumb('/reservations', 'Reservations'),
        new BreadCrumb('/reservations/' + c.id, this.getRentalDate())]);

      this.reset();
    });
  }

  public ngOnChanges(changes: any): void {
    console.log(changes);
  }

  public reset(): void {
    this._settingsService.getSettings().subscribe(s => {
      this.carSettings = s;
      this._carService.getCars().subscribe(response => {
        this.cars = response;
        this.car = this.cars.filter(c => this.reservation.carId === c.id)[0];
        this.filteredCars = this.reservationDetailForm.controls['carId'].valueChanges
          .pipe(
            startWith(''),
            map(c => c ? this.filterCars(c) : this.cars.slice())
          );
      });
      this._customerService.getCustomer(this.reservation.customerId).subscribe(response => {
          this.customer = response;
        }
      );
      this.reservationDetailForm.reset(this.reservation, { onlySelf: true });
      this.reservationDetailForm.controls['customerId'].disable();
    });
  }

  public get calculatedCosts(): number {
    if (!this.carSettings ||  !this.carSettings.carClasses || !this.car) {
      return 0;
    }

    const cls = this.carSettings.carClasses.filter(c => c.id === this.car.classId)[0];
    return cls.cost * this.reservation.days;
  }

  public update(): void {
    if (this.reservationDetailForm.valid) {
      const reservation = Object.assign(this.reservationDetailForm.value as Reservation, {});
      reservation.customerId = this.customer.id;

      const formCar = this.reservationDetailForm.value.carId as Car;
      reservation.carId = formCar.id ? formCar.id : this.car.id;

      this._reservationService.updateReservation(reservation).subscribe(() => {
        this.car = this.cars.filter(c => c.id === reservation.carId)[0];
        this._snackBar.open('updated reservation: ' + moment.utc(reservation.reservationDate)
          .format('DD.MM.YYYY'), null, { duration: 3000 });
        this._reload(this.reservation.id);
      });
    } else {
      this._validator.validateAllFormFields(this.reservationDetailForm);
    }
  }

  public filterCars(brand: any): Car[] {
    if (brand instanceof String) {
      const brands = this.carSettings.carBrands.filter(b => b.title.toLowerCase().indexOf(brand.toLowerCase()) === 0);
      const res: Car[] = [];
      for (const b of brands) {
        res.concat(this.cars.filter(c => c.brandId === b.id));
      }
      return res;
    }
    return this.cars;
  }

  public removeReservation(r: Reservation): void {
    this._reservationService.removeReservation(r).subscribe(success => {
      this.reset();
      this._snackBar.open('removed reservation: ' + moment.utc(r.reservationDate).format('DD.MM.YYYY'), null, { duration: 3000 });
    });
  }

  public confirmReservation(r: Reservation): void {
    r.state = this.ReservationState.Reserved;

    this._reservationService.updateReservation(r).subscribe(result => {
      this._snackBar.open('confirmed reservation: ' + moment.utc(r.reservationDate).format('DD.MM.YYYY'), null, { duration: 3000 });
    });
  }

  public removeContract(r: Reservation): void {
    this._contractService.getContracts().subscribe(contracts => {
      const contract = contracts.filter(c => c.reservationId === r.id)[0];
      this._contractService.removeContract(contract).subscribe(result => {
        this._snackBar.open('successfully removed contract', null, { duration: 3000 });
        r.state = this.ReservationState.Reserved;
      });
    });
  }

  public toRentalContract(r: Reservation): void {
    const contract = Object.assign(r, {}) as any as RentalContract;
    contract.reservationId = r.id;
    this._contractService.addContract(contract).subscribe(result => {
      r.state = this.ReservationState.Contracted;
      this._snackBar.open('Reservation is now under contract!', null, { duration: 3000 });
    });
  }

  public getRentalDate() {
    const from = moment.utc(this.reservation.rentalDate);
    const to = from.clone().add(this.reservation.days, 'days');
    return from.format('DD.MM.YYYY') + ' - ' + to.format('DD.MM.YYYY');
  }

  public getReservationDate() {
    return moment.utc(this.reservation.reservationDate).fromNow();
  }

  public getCustomerInfo() {
    return this.customer.firstName + ' ' + this.customer.lastName;
  }

  public getStateInfo() {
    switch (this.reservation.state) {
      case ReservationState.Pending:
        return 'pendig';
      case ReservationState.Contracted:
        return 'contracted';
      case ReservationState.Reserved:
        return 'reserved';
      default:
        return 'unknown';
    }
  }
  public displayFn(obj: any) {
    return obj ? obj.title : '';
  }

  public displayCar(obj: any) {
    const id = (obj && obj.brandId) ? obj.brandId : obj;
    if (this.car && id === this.car.id) {
      obj = this.car;
    }
    return obj ? this.displayBrand(id) + ' ' + obj.registrationYear : '';
  }

  public displayBrand(id: number) {
    return this.displayFn(this.carSettings.carBrands.filter(b => b.id === id)[0]);
  }

  public displayCustomer() {
    return this.getCustomerInfo();
  }
}
