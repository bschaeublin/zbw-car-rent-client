import {Component, OnInit} from '@angular/core';
import {CustomerService, UnicornService} from '../../services';
import {Customer} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {NewCustomerDialogComponent} from '../newCustomerDialog/newCustomerDialog.component';

@Component({
  selector: 'app-customer-list-page',
  templateUrl: './customerListPage.component.html',
  styleUrls: ['./customerListPage.component.scss']
})
export class CustomerListPageComponent implements OnInit {
  public customers: Customer[];
  public loading = true;
  constructor(private _customerService: CustomerService,
              private _gravatar: UnicornService,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._customerService.getCustomers().subscribe(response => this.customers = response, () => {}, () => { this.loading = false; });
  }

  public getAvatar(c: Customer): string {
    return this._gravatar.getAvatarFromString(c.firstName + c.lastName + c.id, 32);
  }

  public removeCustomer(c: Customer): void {
    this._customerService.removeCustomer(c).subscribe(success => {
      this.reset();
      this._snackBar.open('removed customer: ' + c.firstName + ' ' + c.lastName, null, { duration: 3000 });
    });
  }

  public openDialog() {
    const dialogRef = this._dialog.open(NewCustomerDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.customers.push(result);
      this._snackBar.open('added new customer: ' + result.firstName + ' ' + result.lastName, null, { duration: 3000 });
    });
  }
}
