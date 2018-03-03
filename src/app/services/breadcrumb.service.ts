import { Injectable } from '@angular/core';
import {BreadCrumb} from '../model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BreadCrumbService {
  private _crumbs: BreadCrumb[] = [];
  public onBreadCrumbsChanged = new Subject<BreadCrumb[]>();

  public buildBreadCrumb(crumbs: BreadCrumb[]) {
    this._crumbs = crumbs;
    this.onBreadCrumbsChanged.next(this._crumbs);
  }

  public getBreadCrumbs(): BreadCrumb[] {
    return this._crumbs;
  }
}
