import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { EventsService } from 'src/app/providers/events.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-salelist',
  templateUrl: './salelist.page.html',
  styleUrls: ['./salelist.page.scss'],
})
export class SalelistPage implements OnInit {

  constructor(
    public general: GeneralService,
    public http: HttpService,
    public events: EventsService,
    private iab: InAppBrowser,
  ) { }

  tilesList = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getList()
  }

  getList() {
    this.http.get('SaleList', true).subscribe((res: any) => {
      this.general.stopLoading();
      if(res.status == true){
        this.tilesList = res.data.tiles;
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

  toUserPlace(c){
    setTimeout(()=>{
      this.events.publishToUser(c);
    })
  }

  makePayment(url) {
    if (GlobaldataService.userObject == undefined) {
      this.general.presentToast('Please Login to Continue!')
      return
    }
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
      toolbar: 'no',
      fullscreen: 'yes',
      clearcache: 'no',
      clearsessioncache: 'no',
      cleardata: 'no',
      hardwareback: 'yes',
      useWideViewPort: 'no',
      enableViewportScale: 'yes',
      presentationstyle: 'fullscreen'
    };

    const browser = this.iab.create(url + '/'+ GlobaldataService.userObject.user_id, '_blank', options);

    browser.on('loadstart').subscribe((res) => {
      console.log(res)
      if (res.url.includes('flatmeta.io/TransactionCompleted')) {
        setTimeout(()=>{
          this.general.presentToast('Payment Successfull!');
          browser.close();
          this.general.goToPage('t/thankyou');
        }, 250);
      }
    }, err => {
      console.error(err);
    });
  }

}
