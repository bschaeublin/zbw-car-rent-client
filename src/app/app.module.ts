import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppComponent, CustomerListPageComponent, NewCustomerDialogComponent, NotFoundPageComponent} from './components';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './modules/material/material.module';
import {RouterModule, Routes} from '@angular/router';
import {ALL_COMPONENTS} from './components/_all';
import {ALL_SERVICES} from './services/_all';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoaderInterceptor} from './interceptors/loaderInterceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const appRoutes: Routes = [
  {
    path: 'customers/:id',
    component: NotFoundPageComponent },
  {
    path: 'customers',
    component: CustomerListPageComponent,
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
  entryComponents: [ NewCustomerDialogComponent ],
  providers: [
    ...ALL_SERVICES,
    ...ALL_INTERCEPTORS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
