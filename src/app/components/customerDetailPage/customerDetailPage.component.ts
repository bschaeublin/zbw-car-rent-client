import {Component, OnChanges, OnInit} from '@angular/core';
import {BreadCrumbService, CustomerService, UnicornService, ValidationService} from '../../services';
import {BreadCrumb, Customer} from '../../model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-detail-page',
  templateUrl: './customerDetailPage.component.html',
  styleUrls: ['./customerDetailPage.component.scss']
})
export class CustomerDetailPageComponent implements OnInit, OnChanges {
  public customer: Customer;

  public customerDetailForm: FormGroup = new FormGroup({
    'id': new FormControl(null, []),
    'firstName': new FormControl(null, [Validators.required]),
    'lastName': new FormControl(null, [Validators.required]),
    'phoneNumber': new FormControl(null, []),
    'address': new FormControl(null, []),
    'eMail': new FormControl(null, [Validators.required, Validators.email]),
  });
  constructor(private _customerService: CustomerService,
              private _gravatar: UnicornService,
              private _dialog: MatDialog,
              private _validator: ValidationService,
              private _snackBar: MatSnackBar,
              private _router: Router,
              private _crs: BreadCrumbService,
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
    this._customerService.getCustomer(id).subscribe(c => {
      this.customer = c;
      this._crs.buildBreadCrumb([
        new BreadCrumb('/customers', 'Home'),
        new BreadCrumb('/customers', 'Customers'),
        new BreadCrumb('/customers/' + c.id, c.firstName + ' ' + c.lastName)]);

      this.reset();
    });
  }

  public ngOnChanges(changes: any): void {
    console.log(changes);
  }

  public removeCustomer(c: Customer): void {
    this._customerService.removeCustomer(c).subscribe(success => {
      this._router.navigate(['/customers']);
    });
  }

  public reset(): void {
    this.customerDetailForm.reset(this.customer, { onlySelf: true });
  }

  public update(): void {
    if (this.customerDetailForm.valid) {
      this._customerService.updateCustomer(this.customerDetailForm.value).subscribe(() => {
        this._snackBar.open(
          'updated customer: ' + this.customerDetailForm.value.firstName + ' ' + this.customerDetailForm.value.lastName,
          null,
          { duration: 3000 });
        this._reload(this.customer.id);
      });
    } else {
      this._validator.validateAllFormFields(this.customerDetailForm);
    }
  }

  public getAvatar(c: Customer): string {
    return this._gravatar.getAvatarFromString(c.firstName + c.lastName + c.id, 128);
  }
}
