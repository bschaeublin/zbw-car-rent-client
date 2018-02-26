import {Component, OnChanges, OnInit} from '@angular/core';
import {CustomerService, UnicornService, ValidationService} from '../../services';
import {Customer} from '../../model';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-customer-detail-page',
  templateUrl: './customerDetailPage.component.html',
  styleUrls: ['./customerDetailPage.component.scss']
})
export class CustomerDetailPageComponent implements OnInit, OnChanges {
  public customer: Customer;

  public newCustomerForm: FormGroup = new FormGroup({
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
              private _router: Router,
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
    this.newCustomerForm.reset(this.customer, { onlySelf: true });
  }

  public update(): void {
    if (this.newCustomerForm.valid) {
      this._customerService.updateCustomer(this.newCustomerForm.value).subscribe(() => {
        this._reload(this.customer.id);
      });
    } else {
      this._validator.validateAllFormFields(this.newCustomerForm);
    }
  }

  public getAvatar(c: Customer): string {
    return this._gravatar.getAvatarFromString(c.firstName + c.lastName + c.id, 128);
  }
}
