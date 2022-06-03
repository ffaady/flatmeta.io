import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-myplaces',
  templateUrl: './myplaces.page.html',
  styleUrls: ['./myplaces.page.scss'],
})
export class MyplacesPage implements OnInit {

  constructor(
    public routerOutlet: IonRouterOutlet,
    public general: GeneralService,
    public http: HttpService,
    public events: EventsService
  ) { }

  tilesList = [];
  tilePrice: number = 0;
  selectedGroup: any;
  showSellModal: boolean = false;
  onSale: boolean = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getList()
  }

  getList() {
    this.http.get('MyPlaces', false).subscribe((res: any) => {
      if(res.status == true){
        this.tilesList = res.data.tiles;
      }
    }, (e) => {
      console.log(e)
    })
  }

  showPriceModal(item){
    this.selectedGroup = item;
    this.tilePrice = item.sale_price;
    this.onSale = item.on_sale;
    this.showSellModal = true;
  }

  putOnSale(e){
    this.onSale = e.detail.checked;
  }

  submitPrice() {
    if (this.tilePrice == null) {
      this.general.presentToast('Please Enter Correct Price!');
      return
    };
    let d = {
      order_id: this.selectedGroup.id,
      sale_price: this.tilePrice,
      on_sale: this.onSale
    };
    this.http.post('UpdateSalePrice', d, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.getList();
        this.general.presentToast(res.data.message);
        this.showSellModal = false;        
        this.getList()
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e);
    })
  }

}
