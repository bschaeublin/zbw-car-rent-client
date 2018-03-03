import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../model';

@Injectable()
export class CustomerService {
  private _apiUrl: string = environment.apiUrl + 'customers';
  constructor(private _http: HttpClient) {
  }

  public getCustomers(): Observable<Customer[]> {
    return this._http.get<Customer[]>(this._apiUrl);
  }

  public getCustomer(id: number): Observable<Customer> {
    return this._http.get<Customer>(this._apiUrl + '/' + id);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this._http.post<Customer>(this._apiUrl, customer);
  }

  public removeCustomer(customer: Customer): Observable<void> {
    return this._http.delete<void>(this._apiUrl + '/' + customer.id);
  }

  public updateCustomer(customer: Customer): Observable<void> {
    return this._http.put<void>(this._apiUrl + '/' + customer.id, customer);
  }
}
