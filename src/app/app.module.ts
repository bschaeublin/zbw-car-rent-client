import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  AppComponent, CarsListPageComponent, CustomerDetailPageComponent, CustomerListPageComponent,
  NewCustomerDialogComponent,
  NotFoundPageComponent, CarBrandSettingsComponent, NewCarDialogComponent
} from './components';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './modules/material/material.module';
import {RouterModule, Routes} from '@angular/router';
import {ALL_COMPONENTS} from './components/_all';
import {ALL_SERVICES} from './services/_all';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoaderInterceptor} from './interceptors/loaderInterceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SettingsPageComponent} from './components/settingsPage/settingsPage.component';

const appRoutes: Routes = [
  {
    path: 'customers/:id',
    component: CustomerDetailPageComponent },
  {
    path: 'customers',
    component: CustomerListPageComponent,
  },
  {
    path: 'cars/:id',
    component: NotFoundPageComponent },
  {
    path: 'cars',
    component: CarsListPageComponent,
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
  },
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  { path: '**', component: NotFoundPageComponent }
];

export const ALL_INTERCEPTORS = [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi : true
    }
  ];

@NgModule({
  declarations: [
    ...ALL_COMPONENTS
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  entryComponents: [ NewCustomerDialogComponent, NewCarDialogComponent ],
  providers: [
    ...ALL_SERVICES,
    ...ALL_INTERCEPTORS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
