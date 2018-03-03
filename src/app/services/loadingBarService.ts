import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LoadingBarService {
  public onStart = new Subject();
  public onComplete = new Subject<void>();

  constructor() {
  }

  public start(): void {
    this.onStart.next();
  }

  public complete(): void {
    this.onComplete.next();
  }
}
