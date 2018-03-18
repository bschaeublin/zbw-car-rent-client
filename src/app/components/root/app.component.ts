import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {LoadingBarService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public loading: boolean;
  public sideNavOpened = true;
  constructor(private _loadingBarService: LoadingBarService, private _router: Router) {
    this._loadingBarService.onStart.subscribe(() => {
      setTimeout(() => { this.loading = true; }, 0);
    });

    this._loadingBarService.onComplete.subscribe(() => {
      setTimeout(() => { this.loading = false; }, 0);
    });
  }

  public ngOnInit() {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {this._collapseNavOnMobile(); }, 0);
  }

  public isRouteSelected(route: string) {
    return this._router.isActive(route, false);
  }

  private _collapseNavOnMobile(): void {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (width < 640) {
      this.sideNavOpened = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this._collapseNavOnMobile();
  }
}
