import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {RentalContract, Reservation} from '../model';

@Injectable()
export class ContractService {
  private _apiUrl: string = environment.apiUrl + 'contracts';
  constructor(private _http: HttpClient) {
  }

  public getContracts(): Observable<RentalContract[]> {
    return this._http.get<RentalContract[]>(this._apiUrl);
  }

  public getContract(id: number): Observable<RentalContract> {
    return this._http.get<RentalContract>(this._apiUrl + '/' + id);
  }

  public addContract(contract: RentalContract): Observable<RentalContract> {
    return this._http.post<RentalContract>(this._apiUrl, contract);
  }

  public removeContract(contract: RentalContract): Observable<void> {
    return this._http.delete<void>(this._apiUrl + '/' + contract.id);
  }

  public updateContract(contract: RentalContract): Observable<void> {
    return this._http.put<void>(this._apiUrl + '/' + contract.id, contract);
  }
}
