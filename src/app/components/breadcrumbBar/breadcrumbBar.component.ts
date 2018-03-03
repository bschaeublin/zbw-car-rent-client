import {Component, OnInit} from '@angular/core';
import {BreadCrumbService} from '../../services';
import {BreadCrumb} from '../../model';

@Component({
  selector: 'app-breadcrumb-bar',
  templateUrl: './breadcrumbBar.component.html',
  styleUrls: ['./breadcrumbBar.component.scss']
})
export class BreadCrumbBarComponent implements OnInit {
  public crumbs: BreadCrumb[] = [];
  constructor(private _breadcrumbService: BreadCrumbService) {
    this._breadcrumbService.onBreadCrumbsChanged.subscribe(crmbs => {
      console.log(crmbs);
      this.crumbs = crmbs;
    });
  }

  public ngOnInit(): void {
  }
}
