export class BreadCrumb {
  public route: string;
  public params: any[];
  public title: string;

  public constructor(route: string, title: string, params?: any[]) {
    this.route = route;
    this.title = title;
    this.params = params;
  }
}
