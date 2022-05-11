import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

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
    public http: HttpService
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
