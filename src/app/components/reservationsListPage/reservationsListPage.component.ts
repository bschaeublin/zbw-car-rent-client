import {Component, OnInit} from '@angular/core';
import {BreadCrumbService, CustomerService, ReservationService, SettingsService, UnicornService} from '../../services';
import {BreadCrumb, Car, Customer, Reservation, ReservationState} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CarService} from '../../services';
import {NewCarDialogComponent} from '../newCarDialog/newCarDialog.component';
import {CarSettings} from '../../model/carSettings';
import * as moment from 'moment';
import {weekdays} from 'moment';
import {NewReservationDialogComponent} from '../newReservationDialog/newReservationDialog.component';

@Component({
  selector: 'app-reservations-list-page',
  templateUrl: './reservationsListPage.component.html',
  styleUrls: ['./reservationsListPage.component.scss']
})
export class ReservationsListPageComponent implements OnInit {
  public reservations: Reservation[];
  public carSettings: CarSettings;
  public customers: Customer[];
  public cars: Car[];

  constructor(private _carService: CarService,
              private _gravatar: UnicornService,
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

  public removeReservation(r: Reservation): void {
    this._rss.removeReservation(r).subscribe(success => {
      this.reset();
      this._snackBar.open('removed reservation: ' + moment.utc(r.reservationDate).format('DD.MM.YYYY'), null, { duration: 3000 });
    });
  }

  public getReservationInfo(id: number) {
    if (!this.reservations) {
      return 'free';
    }

    const reservations = this.reservations.filter(r => r.carId === id).sort((a, b) => {
      if (a.rentalDate > b.rentalDate) {
        return 1;
      }

      if (a.rentalDate < b.rentalDate) {
        return -1;
      }

      return 0;
    });

    const nextReservation = reservations[0];
    if (nextReservation) {
      const rentalDate = moment.utc(nextReservation.rentalDate);
      const rentalToDate = rentalDate.clone().add(nextReservation.days, 'days');

      if (rentalDate.isAfter(moment.utc(), 'day')) {
        return 'Status: Free until ' + rentalDate.format('DD.MM.YYYY');
      }
      if (rentalDate.isSame(moment.utc(), 'day')) {
        return 'Status: Booked today';
      }

      if (rentalDate.isBefore(moment.utc()) && rentalToDate.isSameOrAfter(moment())) {
        return 'Status: Booked from ' + rentalDate.format('DD.MM.YYYY') + ' to ' + rentalToDate.format('DD.MM.YYYY');
      }

      return 'Status: Free, last booked ' + rentalDate.fromNow();
    }

    return 'Status: free';
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
    dialogRef.afterClosed().subscribe(result => {
      this.reservations.push(result);
      this._snackBar.open('added new car: ' + result, null, { duration: 3000 });
    });
  }
}
