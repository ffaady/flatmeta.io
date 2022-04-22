import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';

@Component({
  selector: 'app-myplaces',
  templateUrl: './myplaces.page.html',
  styleUrls: ['./myplaces.page.scss'],
})
export class MyplacesPage implements OnInit {

  constructor(
    public storage: StorageService,
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
    this.http.get2('TileDetails', true).subscribe((res: any) => {
      this.general.stopLoading();
      console.log(res);
      if(res.status == true){
        this.tilesList = res.data;
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

}
