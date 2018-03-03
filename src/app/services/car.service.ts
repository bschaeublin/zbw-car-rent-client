import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Car} from '../model';

@Injectable()
export class CarService {
  private _apiUrl: string = environment.apiUrl + 'cars';
  constructor(private _http: HttpClient) {
  }

  public getCars(): Observable<Car[]> {
    return this._http.get<Car[]>(this._apiUrl);
  }

  public getCar(id: number): Observable<Car> {
    return this._http.get<Car>(this._apiUrl + '/' + id);
  }

  public addCar(car: Car): Observable<Car> {
    return this._http.post<Car>(this._apiUrl, car);
  }

  public removeCar(car: Car): Observable<void> {
    return this._http.delete<void>(this._apiUrl + '/' + car.id);
  }

  public updateCar(car: Car): Observable<void> {
    return this._http.put<void>(this._apiUrl + '/' + car.id, car);
  }
}
