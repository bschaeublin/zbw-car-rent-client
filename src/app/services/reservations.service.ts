import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Reservation} from '../model';

@Injectable()
export class ReservationService {
  private _apiUrl: string = environment.apiUrl + 'reservations';
  constructor(private _http: HttpClient) {
  }

  public getReservations(): Observable<Reservation[]> {
    return this._http.get<Reservation[]>(this._apiUrl);
  }

  public getReservation(id: number): Observable<Reservation> {
    return this._http.get<Reservation>(this._apiUrl + '/' + id);
  }

  public addReservation(reservation: Reservation): Observable<Reservation> {
    return this._http.post<Reservation>(this._apiUrl, reservation);
  }

  public removeReservation(reservation: Reservation): Observable<void> {
    return this._http.delete<void>(this._apiUrl + '/' + reservation.id);
  }

  public updateReservation(reservation: Reservation): Observable<void> {
    return this._http.put<void>(this._apiUrl + '/' + reservation.id, reservation);
  }
}
