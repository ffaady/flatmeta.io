import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private LoginObj = new Subject<any>();
  private appTextObj = new Subject<any>();
  private toHome = new Subject<boolean>();
  private toUser = new Subject<any>();

  constructor() { }

  publishLogin(data: any) {
    this.LoginObj.next(data);
  }

  receiveLogin(): Subject<any> {
    return this.LoginObj;
  }

  publishAppText(data: any) {
    this.appTextObj.next(data);
  }

  receiveApptext(): Subject<any> {
    return this.appTextObj;
  }

  publishToHome(data: boolean){
    this.toHome.next(data);
  }

  receiveToHome(): Subject<boolean>{
   return this.toHome; 
  }

  publishToUser(data: any){
    this.toUser.next(data);
  }

  receiveToUser(): Subject<any>{
    return this.toUser;
  }


}