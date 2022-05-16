import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';

@Component({
  selector: 'app-myplaces',
  templateUrl: './myplaces.page.html',
  styleUrls: ['./myplaces.page.scss'],
})
export class MyplacesPage implements OnInit {

  constructor(
    public general: GeneralService,
    public http: HttpService
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

}
