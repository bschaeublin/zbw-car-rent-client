import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CarClass} from '../../../model';
import {SettingsService, ValidationService} from '../../../services';

@Component({
  selector: 'app-car-classes-settings',
  templateUrl: './carClassesSettings.component.html',
  styleUrls: ['./carClassesSettings.component.scss']
})
export class CarClassSettingsComponent implements OnInit {
  public carClasses: CarClass[];

  public newCarClassForm: FormGroup = new FormGroup({
    'id': new FormControl(null, []),
    'title': new FormControl(null, [Validators.required]),
    'cost': new FormControl(null, [Validators.required]),
  });
  constructor(private _settingsService: SettingsService,
              private _dialog: MatDialog,
              private _validator: ValidationService,
              private _snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this._resetClasses();
  }

  private _resetClasses(): void {
    this._settingsService.getClasses().subscribe(c => this.carClasses = c);
  }

  public removeType(b: CarClass): void {
    this._settingsService.removeClass(b).subscribe(success => {
      this.reset();
      this._snackBar.open('removed class: ' + b.title, null, { duration: 3000 });
    });
  }

  public addClass(): void {
    if (this.newCarClassForm.valid) {
      console.log(this.newCarClassForm.value);
      const carClass = new CarClass();
      carClass.title = this.newCarClassForm.value.title;
      carClass.cost = this.newCarClassForm.value.cost;

      this._settingsService.addClass(carClass).subscribe(newClass => {
        this.reset();
        this._snackBar.open('added class: ' + newClass.title, null, { duration: 3000 });
      });
    } else {
      this._validator.validateAllFormFields(this.newCarClassForm);
    }
  }

  public toggleEdit(c: CarClass): void {
    c.edit = true;
  }

  public updateClass(c: CarClass): void {
    this._settingsService.updateClass(c).subscribe(() => {
      this.reset();
      this._snackBar.open('updated class: ' + c.title, null, { duration: 3000 });
    });
  }

}
