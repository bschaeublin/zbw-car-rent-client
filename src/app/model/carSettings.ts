import {CarBrand} from './carBrand';
import {CarClass} from './carClass';
import {CarType} from './carType';

export class CarSettings {
  public carBrands: CarBrand[];
  public carClasses: CarClass[];
  public carTypes: CarType[];

  public findType(id: number): CarType {
    return this.carTypes ? this.carTypes.filter(t => t.id === id)[0] : null;
  }

  public findClass(id: number): CarClass {
    return this.carClasses ? this.carClasses.filter(c => c.id === id)[0] : null;
  }

  public findBrand(id: number): CarBrand {
    return this.carBrands ? this.carBrands.filter(b => b.id === id)[0] : null;
  }
}
