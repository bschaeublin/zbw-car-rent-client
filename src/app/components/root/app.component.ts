import {Component, OnInit} from '@angular/core';
import {LoadingBarService} from '../../services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading: boolean;

  constructor(private _loadingBarService: LoadingBarService) {
    this._loadingBarService.onStart.subscribe(() => {
      setTimeout(() => { this.loading = true; }, 0);
    });

    this._loadingBarService.onComplete.subscribe(() => {
      setTimeout(() => { this.loading = false; }, 0);
    });
  }

  public ngOnInit() {

  }
}
