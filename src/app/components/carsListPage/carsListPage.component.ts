import {Component, OnInit} from '@angular/core';
import {BreadCrumbService, ReservationService, SettingsService} from '../../services';
import {BreadCrumb, Car, Reservation} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CarService} from '../../services';
import {NewCarDialogComponent} from '../newCarDialog/newCarDialog.component';
import {CarSettings} from '../../model/carSettings';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-list-page',
  templateUrl: './carsListPage.component.html',
  styleUrls: ['./carsListPage.component.scss']
})
export class CarsListPageComponent implements OnInit {
  public cars: Car[];
  public carSettings: CarSettings;
  public reservations: Reservation[];

  constructor(private _carService: CarService,
              private _rss: ReservationService,
              private _dialog: MatDialog,
              private _crs: BreadCrumbService,
              private _settingsService: SettingsService,
              private _snackBar: MatSnackBar) {
    this._crs.buildBreadCrumb([
      new BreadCrumb('/customers', 'Home'),
      new BreadCrumb('/cars', 'Cars')]);
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._settingsService.getSettings().subscribe(s => {
      this.carSettings = s;
      this._rss.getReservations().subscribe((r) => {
        this.reservations = r;
      });
      this._carService.getCars().subscribe(response => this.cars = response);
    });
  }

  public removeCar(c: Car): void {
    this._carService.removeCar(c).subscribe(success => {
      this.reset();
      this._snackBar.open('removed car: ' + c.brandId, null, { duration: 3000 });
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

  public openDialog() {
    const dialogRef = this._dialog.open(NewCarDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cars.push(result);
        this._snackBar.open('added new car: ' + result.brandid, null, { duration: 3000 });
      }
    });
  }
}
