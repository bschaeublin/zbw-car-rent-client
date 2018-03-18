import { Injectable } from '@angular/core';
import {BreadCrumb} from '../model';
import {Subject} from 'rxjs/Subject';
import {SeoService} from './seo.service';

@Injectable()
export class BreadCrumbService {
  constructor(private _seo: SeoService) {

  }

  private _crumbs: BreadCrumb[] = [];
  public onBreadCrumbsChanged = new Subject<BreadCrumb[]>();

  public buildBreadCrumb(crumbs: BreadCrumb[]) {
    this._crumbs = crumbs;

    if (this._crumbs && this._crumbs.length > 0) {
      const lastCrumbTitle = this._crumbs[this._crumbs.length - 1].title;
      this._seo.setTitle(lastCrumbTitle);
    }

    this.onBreadCrumbsChanged.next(this._crumbs);
  }

  public getBreadCrumbs(): BreadCrumb[] {
    return this._crumbs;
  }
}
