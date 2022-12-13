import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-recentpurchases',
  templateUrl: './recentpurchases.page.html',
  styleUrls: ['./recentpurchases.page.scss'],
})
export class RecentpurchasesPage implements OnInit {

  constructor(
    public general: GeneralService,
    public http: HttpService,
    public events: EventsService
  ) { }

  tilesList = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getList()
  }

  getList() {
    this.http.get('LatestPurchasedTiles', true).subscribe((res: any) => {
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

}
