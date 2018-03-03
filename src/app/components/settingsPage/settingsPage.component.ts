import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BreadCrumbService} from '../../services';
import {BreadCrumb} from '../../model';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settingsPage.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./settingsPage.component.scss']
})
export class SettingsPageComponent implements OnInit {

  constructor(private _crs: BreadCrumbService) {
    this._crs.buildBreadCrumb([new BreadCrumb('/customers', 'Home'), new BreadCrumb('/settings', 'Settings')]);
  }
  public ngOnInit(): void {
  }

}
