import { Injectable } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class UnicornService {
  private _apiUrl = 'https://unicornify.appspot.com/avatar/';
  constructor() {
  }

  public getAvatarFromString(str: string, size: number = 32): string {
    return this ._apiUrl + Md5.hashStr(str.toLocaleLowerCase()) + '?s=' + size;
  }
}
