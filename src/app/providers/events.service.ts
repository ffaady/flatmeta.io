import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private LoginObj = new Subject<any>();
  private appTextObj = new Subject<any>();

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


}