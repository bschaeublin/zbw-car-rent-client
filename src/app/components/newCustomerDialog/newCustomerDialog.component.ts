import {Component, OnInit} from '@angular/core';
import {CustomerService, UnicornService, ValidationService} from '../../services';
import {Customer} from '../../model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-customer-dialog',
  templateUrl: './newCustomerDialog.component.html',
  styleUrls: ['./newCustomerDialog.component.scss']
})
export class NewCustomerDialogComponent implements OnInit {
  public customers: Customer[];
  public loading = true;
  public newCustomerForm: FormGroup = new FormGroup({
    'firstName': new FormControl(null, [Validators.required]),
    'lastName': new FormControl(null, [Validators.required]),
    'phoneNumber': new FormControl(null, []),
    'address': new FormControl(null, []),
    'eMail': new FormControl(null, [Validators.required, Validators.email]),
  });

  constructor(private _customerService: CustomerService,
              private _dialogRef: MatDialogRef<NewCustomerDialogComponent>,
              private _validator: ValidationService) {
  }

  public ngOnInit(): void {
    this._customerService.getCustomers().subscribe(response => this.customers = response, () => {}, () => { this.loading = false; });
  }

  public onSubmit(): void {
    if (this.newCustomerForm.valid) {
      this._customerService.addCustomer(this.newCustomerForm.value).subscribe(result => { this._dialogRef.close(result); });
    } else {
      console.log('validating');
      this._validator.validateAllFormFields(this.newCustomerForm);
    }
  }

  public onCancel(): void {
    this._dialogRef.close(null);
  }
}
