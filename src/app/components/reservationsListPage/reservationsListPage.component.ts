import {Component, OnInit} from '@angular/core';
import {BreadCrumbService, CustomerService, ReservationService, SettingsService, UnicornService} from '../../services';
import {BreadCrumb, Car, Customer, RentalContract, Reservation, ReservationState} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CarService} from '../../services';
import {NewCarDialogComponent} from '../newCarDialog/newCarDialog.component';
import {CarSettings} from '../../model/carSettings';
import * as moment from 'moment';
import {weekdays} from 'moment';
import {NewReservationDialogComponent} from '../newReservationDialog/newReservationDialog.component';
import {ContractService} from '../../services/contract.service';

@Component({
  selector: 'app-reservations-list-page',
  templateUrl: './reservationsListPage.component.html',
  styleUrls: ['./reservationsListPage.component.scss']
})
export class ReservationsListPageComponent implements OnInit {
  public reservations: Reservation[];
  public carSettings: CarSettings;
  public ReservationState = ReservationState;

  public customers: Customer[];
  public cars: Car[];

  constructor(private _carService: CarService,
              private _gravatar: UnicornService,
              private _contractService: ContractService,
              private _customerService: CustomerService,
              private _rss: ReservationService,
              private _dialog: MatDialog,
              private _crs: BreadCrumbService,
              private _settingsService: SettingsService,
              private _snackBar: MatSnackBar) {
    this._crs.buildBreadCrumb([
      new BreadCrumb('/customers', 'Home'),
      new BreadCrumb('/reservations', 'Reservations')]);
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._settingsService.getSettings().subscribe(s => {
      this.carSettings = s;
      this._carService.getCars().subscribe(response => this.cars = response);
      this._customerService.getCustomers().subscribe(response => {
          this.customers = response;
          this._rss.getReservations().subscribe(r => this.reservations = r);
        }
      );
    });
  }

  public getCalculatedCosts(reservation: Reservation): number {
    if (!this.carSettings ||  !this.carSettings.carClasses) {
      return 0;
    }

    const car = this.cars.filter(c => c.id === reservation.carId)[0];
    if (!car) {
      return 0;
    }

    const cls = this.carSettings.carClasses.filter(c => c.id === car.classId)[0];
    return cls.cost * reservation.days;
  }

  public removeReservation(r: Reservation): void {
    this._rss.removeReservation(r).subscribe(success => {
      this.reset();
      this._snackBar.open('removed reservation: ' + moment.utc(r.reservationDate).format('DD.MM.YYYY'), null, { duration: 3000 });
    });
  }

  public getRentalDate(res: Reservation) {
    const from = moment.utc(res.rentalDate);
    const to = from.clone().add(res.days, 'days');
    return from.format('DD.MM.YYYY') + ' - ' + to.format('DD.MM.YYYY');
  }

  public getReservationDate(res: Reservation) {
    return moment.utc(res.reservationDate).fromNow();
  }

  public getCustomerInfo(res: Reservation) {
    const customer = this.customers.filter(c => c.id === res.customerId)[0];
    return customer.firstName + ' ' + customer.lastName;
  }

  public getCarsInfo(res: Reservation) {
    const car = this.cars.filter(c => c.id === res.carId)[0];
    const brand = this.carSettings.findBrand(car.brandId);
    return brand.title + ' (' + car.registrationYear  + ')';
  }

  public getStateInfo(res: Reservation) {
    switch (res.state) {
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

  public openDialog() {
    const dialogRef = this._dialog.open(NewReservationDialogComponent);
    dialogRef.afterClosed().subscribe((result: Reservation) => {
      if (result) {
        this.reservations.push(result);
        this._snackBar.open('added new reservation: ' + moment(result.reservationDate).format('DD.mm.YYYY'), null, { duration: 3000 });
      }
    });
  }
}
