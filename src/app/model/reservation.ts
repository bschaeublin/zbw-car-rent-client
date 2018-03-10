import {ReservationState} from './reservationState';

export class Reservation {
  public id: number;
  public carId: number;
  public customerId: number;
  public days: number;
  public state: ReservationState;
  public rentalDate: string;
  public reservationDate: string;
}
