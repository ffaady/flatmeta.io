import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartData = [];

  constructor(
    public storage: StorageService,
    public general: GeneralService,
    public http: HttpService,
    private iab: InAppBrowser,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getCart()
  }

  getCart() {
    this.http.get('GetCartByUser', true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.cartData = res.data.tiles;
      }
    }, (e) => {
      this.general.stopLoading()
      console.log(e)
    })
  }

  makeBuy() {
    this.http.get('BuyNow', true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.general.presentToast(res.data.message);
        this.general.goToPage('t/home');
      }
    },
      (e) => {
        this.general.stopLoading()
        console.log(e)
      })
  }

  makePayment(amt) {
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

    const browser = this.iab.create('https://cocoon-paypal.herokuapp.com/pay/' + amt, '_blank', options);

    browser.on('loadstart').subscribe((res) => {

      let uri = res.url.split('?');
      if (uri[0] == 'https://cocoon-paypal.herokuapp.com/success') {
        browser.close();
      }
    }, err => {
      console.error(err);
    });
  }

  removeFromCart() {
    this.http.get('RemoveUserCart', true).subscribe((res: any) => {
      if (res.status == true) {
        this.general.stopLoading();
        this.general.presentToast(res.data.message);
        this.cartData = [];
        this.general.goBack();
      }
    }, (e) => {
      this.general.stopLoading();
      this.general.presentToast('Something went wrong!')
    })
  }

}
