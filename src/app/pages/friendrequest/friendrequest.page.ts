import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
@Component({
  selector: 'app-friendrequest',
  templateUrl: './friendrequest.page.html',
  styleUrls: ['./friendrequest.page.scss'],
})
export class FriendrequestPage implements OnInit {

  requests = [];

  constructor(
    public general: GeneralService,
    public http: HttpService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getReqList();
  }

  getReqList() {
    this.http.get('GetAllFriendRequest', true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.requests = res.data.requests;
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

  updateRequest(rid, status) {
    let d = {
      request_id: rid,
      status: status
    }
    this.http.post('UpdateFriendRequestStatus', d, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.getReqList();
        this.general.presentToast(res.data.message);
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

}
