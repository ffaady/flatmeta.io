import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobaldataService {

  constructor() { }

  public static deviceToken: string = '';
  public static userObject: any = undefined;
  public static loginToken: any = '';

  public static addCategory: any = undefined;
  public static locationObj:any = undefined;
  public static appText: any;
  public static darkMode: boolean = false;
  
  static clearGobal() {
    this.userObject = undefined;
    this.loginToken = undefined;
  }

}