import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {CarBrand, CarClass, CarType} from '../model';
import {CarSettings} from '../model/carSettings';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs/observable/forkJoin';

@Injectable()
export class SettingsService {
  private _apiUrl: string = environment.apiUrl + 'basedata/';
  private _brandsUrl: string = this._apiUrl + 'CarBrands';
  private _classesUrl: string = this._apiUrl + 'CarClasses';
  private _typesUrl: string = this._apiUrl + 'CarTypes';

  constructor(private _http: HttpClient) {
  }

  public getSettings(): Observable<CarSettings> {
    return forkJoin(
      this.getClasses(),
      this.getTypes(),
      this.getBrands()
    ).pipe(map(data => {
      const carClasses = data[0];
      const carTypes = data[1];
      const carBrands = data[2];

      const settings = new CarSettings();
      settings.carBrands = carBrands;
      settings.carTypes = carTypes;
      settings.carClasses = carClasses;
      return settings;
    }));
  }

  /* BRANDS */
  public getBrands(): Observable<CarBrand[]> {
    return this._http.get<CarBrand[]>(this._brandsUrl);
  }

  public getBrand(id: number): Observable<CarBrand> {
    return this._http.get<CarBrand>(this._brandsUrl + '/' + id);
  }

  public addBrand(brand: CarBrand): Observable<CarBrand> {
    return this._http.post<CarBrand>(this._brandsUrl, brand);
  }

  public removeBrand(brand: CarBrand): Observable<void> {
    return this._http.delete<void>(this._brandsUrl + '/' + brand.id);
  }

  public updateBrand(brand: CarBrand): Observable<void> {
    return this._http.put<void>(this._brandsUrl + '/' + brand.id, brand);
  }

  /* CLASSES  */
  public getClasses(): Observable<CarClass[]> {
    return this._http.get<CarClass[]>(this._classesUrl);
  }

  public getClass(id: number): Observable<CarClass> {
    return this._http.get<CarClass>(this._classesUrl + '/' + id);
  }

  public addClass(carClass: CarClass): Observable<CarClass> {
    return this._http.post<CarClass>(this._classesUrl, carClass);
  }

  public removeClass(carClass: CarClass): Observable<void> {
    return this._http.delete<void>(this._classesUrl + '/' + carClass.id);
  }

  public updateClass(carClass: CarClass): Observable<void> {
    return this._http.put<void>(this._classesUrl + '/' + carClass.id, carClass);
  }

  /* TYPES */

  public getTypes(): Observable<CarType[]> {
    return this._http.get<CarType[]>(this._typesUrl);
  }

  public getType(id: number): Observable<CarType> {
    return this._http.get<CarType>(this._typesUrl + '/' + id);
  }

  public addType(type: CarType): Observable<CarType> {
    return this._http.post<CarType>(this._typesUrl, type);
  }

  public removeType(type: CarType): Observable<void> {
    return this._http.delete<void>(this._typesUrl + '/' + type.id);
  }

  public updateType(type: CarType): Observable<void> {
    return this._http.put<void>(this._typesUrl + '/' + type.id, type);
  }
}
