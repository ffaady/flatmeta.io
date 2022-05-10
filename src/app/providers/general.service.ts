import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, PopoverController, Platform, ModalController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  loading: any;

  //globalUrl: string = 'https://leafletdemo.mewebe.net/API/index.php?action=';
  globalUrl: string = 'https://api.flatmeta.io/api/';

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router,
    public modalController: ModalController,
    private popoverController: PopoverController,
    private plt: Platform,
    private _location: Location,
    private menu: MenuController
  ) {

  }

  validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true
    }
    return false
  }

  async presentAlert(h, m) {
    const alert = await this.alertController.create({
      header: h,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(m, d = 3000) {
    const toast = await this.toastController.create({
      message: m,
      duration: d
    });
    toast.present();
  }

  async presentLoading(m = 'Please Wait') {
    this.loading = await this.loadingController.create({
      message: m,
      showBackdrop: true
    });
    await this.loading.present();
  }

  async presentLoading2(m = 'Please Wait') {
    this.loading = await this.loadingController.create({
      message: m,
      showBackdrop: true
    });
    await this.loading.present();
  }

  stopLoading() {
    this.loading.dismiss();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }

  async closePopoverWithData(data) {
    await this.popoverController.dismiss(data);
  }

  goToPage(page) {
    this.router.navigate(['/' + page]);
  }

  goToPagewithParam(page, data) {
    this.router.navigate(['/' + page, { data: data }]);
  }

  goBack() {
    this._location.back()
  }

  toggleMenu() {
    this.menu.toggle();
  }

  swapArray(Array: any, Swap1: number, Swap2: number): any {
    var temp = Array[Swap1].img;
    Array[Swap1].img = Array[Swap2].img
    Array[Swap2].img = temp
    return Array;
  }

}