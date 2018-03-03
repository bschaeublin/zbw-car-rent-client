import {Component, OnInit} from '@angular/core';
import {LoadingBarService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading: boolean;

  constructor(private _loadingBarService: LoadingBarService, private _router: Router) {
    this._loadingBarService.onStart.subscribe(() => {
      setTimeout(() => { this.loading = true; }, 0);
    });

    this._loadingBarService.onComplete.subscribe(() => {
      setTimeout(() => { this.loading = false; }, 0);
    });
  }

  public ngOnInit() {

  }

  public isRouteSelected(route: string) {
    return this._router.isActive(route, false);
  }
}
