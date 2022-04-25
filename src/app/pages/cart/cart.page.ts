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
    if (GlobaldataService.userObject != undefined) {
      this.getCart(GlobaldataService.userObject.id)
    } else {
      this.general.presentToast('Please Login to Continue!');
      this.general.goToPage('login');
    }
  }

  getCart(id) {
    this.http.post2('GetCart', { user_id: id }, true).subscribe((res: any) => {
      this.general.stopLoading()
      console.log(res);
      if (res.status == true) {
        this.cartData = res.data.tiles;
      }
    }, (e) => {
      this.general.stopLoading()
      console.log(e)
    })
  }

  makeBuy() {
    let save = {
      boxs: this.cartData,
      user_id: GlobaldataService.userObject.id,
    };
    this.http.post2('AddTiles', save, true).subscribe((res: any) => {
      this.general.stopLoading()
      if (res.status == true) {
        this.general.presentToast('Boxes bought successfully!');
        this.general.goToPage('tabs/home');
      }
    },
      (e) => {
        this.general.stopLoading()
        console.log(e)
      })
  }

}
