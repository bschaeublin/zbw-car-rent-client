import { Injectable } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class SeoService {
  private static APPNAME = 'Car Rent';

  constructor(private _title: Title) {
  }

  public setTitle(title: string) {
    this._title.setTitle(SeoService.APPNAME + ' - ' + title);
  }
}
