import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { GlobaldataService } from './globaldata.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    public general: GeneralService,
    public storage: StorageService
  ) {

  }

  //New APi Setup
  post(link, data, loader){
    if (loader == true) {
      this.general.presentLoading();
    }
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
      'Accept': 'application/json'
    };

    return this.http.post(this.general.globalUrl + link, JSON.stringify(data), { headers: headers })
  }

  post2(link, data, loader){
    if (loader == true) {
      this.general.presentLoading();
    }
    let headers = { 'Content-Type': 'application/json' };

    return this.http.post(this.general.globalUrl + link, JSON.stringify(data), { headers: headers })
  }

  get(link, loader){
    if (loader == true) {
      this.general.presentLoading();
    }
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
      'Accept': 'application/json'
    };

    return this.http.get(this.general.globalUrl + link, { headers: headers })
  }

  get2(link, loader){
    if (loader == true) {
      this.general.presentLoading();
    }
    let headers = { 'Content-Type': 'application/json' };

    return this.http.get(this.general.globalUrl + link, { headers: headers })
  }

  uploadImages(fileToUpload: File, url) {
    const formData = new FormData();
    formData.append('images', fileToUpload);
    let headers = {
      //'Authorization': 'Bearer ' + GlobaldataService.loginToken,
    };
    return this.http.post(this.general.globalUrl + url, formData, { headers: headers });
  }

}