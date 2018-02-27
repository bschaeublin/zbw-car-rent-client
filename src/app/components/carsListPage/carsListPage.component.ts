import {Component, OnInit} from '@angular/core';
import {UnicornService} from '../../services';
import {Car} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {NewCustomerDialogComponent} from '../newCustomerDialog/newCustomerDialog.component';
import {CarService} from '../../services/car.service';

@Component({
  selector: 'app-customer-list-page',
  templateUrl: './carsListPage.component.html',
  styleUrls: ['./carsListPage.component.scss']
})
export class CarsListPageComponent implements OnInit {
  public cars: Car[];

  constructor(private _carService: CarService,
              private _gravatar: UnicornService,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._carService.getCars().subscribe(response => this.cars = response);
  }

  public getAvatar(c: Car): string {
    return this._gravatar.getAvatarFromString(c.id.toString(), 32);
  }

  public removeCar(c: Car): void {
    this._carService.removeCar(c).subscribe(success => {
      this.reset();
      this._snackBar.open('removed car: ' + c.brandId, null, { duration: 3000 });
    });
  }

  public openDialog() {
    const dialogRef = this._dialog.open(NewCustomerDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.cars.push(result);
      this._snackBar.open('added new car: ' + result.brandid, null, { duration: 3000 });
    });
  }
}
