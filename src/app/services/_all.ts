import {CustomerService} from './customer.service';
import {LoadingBarService} from './loadingBarService';
import {UnicornService} from './unicorn.service';
import {ValidationService} from './validation.service';
import {CarService} from './car.service';
import {SettingsService} from './settings.service';
import {BreadCrumbService} from './breadcrumb.service';
import {ReservationService} from './reservations.service';

export const ALL_SERVICES = [
  CustomerService,
  LoadingBarService,
  UnicornService,
  ValidationService,
  CarService,
  SettingsService,
  ReservationService,
  BreadCrumbService,
];
