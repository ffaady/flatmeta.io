import { Component } from '@angular/core';
import { GeneralService } from './providers/general.service';
import { StorageService } from './providers/storage.service';
import { Platform, AlertController } from '@ionic/angular';
import { GlobaldataService } from './providers/globaldata.service';
import { EventsService } from './providers/events.service';
import { HttpService } from './providers/http.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  darkMode: boolean = false;
  profile: any = undefined;

  pages = [
    {
      title: "Profile",
      url: '/t/profile'
    },
    {
      title: "My Cart",
      url: '/t/cart'
    }
  ];

  constructor(
    public general: GeneralService,
    public alertController: AlertController,
    private platform: Platform,
    private storage: StorageService,
    public events: EventsService,
    public http: HttpService
  ) {
    this.initializeApp();
    this.events.receiveLogin().subscribe((res: any) => {
      this.profile = res;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getLoginUser();
      this.checkdarkMode();
    });
  }

  async getLoginUser() {
    let res: any = await this.storage.getObject('login_token');
    if (res != null) {
      GlobaldataService.loginToken = res;
      this.getUserDetails();
    } else {
      this.storage.removeItem('userObject');
      this.storage.removeItem('login_token');
    }
  }

  getUserDetails() {
    this.http.get('getuserbytoken', false).subscribe((res: any) => {
      if (res.status == true) {
        GlobaldataService.userObject = res.data;
        this.storage.setObject('userObject', res.data);
        this.events.publishLogin(res.data) 
      }
    }, (e) => {
      console.log(e);
    })
  }

  checkdarkMode() {
    this.storage.getObject('darkMode').then((res) => {
      if (res != null) {
        let a: any = res;
        if (a == true) {
          this.darkMode = true;
          GlobaldataService.darkMode = true;
          this.storage.setObject('darkMode', a)
          document.body.classList.toggle('dark', a);
        } else {
          this.darkMode = false;
          GlobaldataService.darkMode = false;
          this.storage.setObject('darkMode', a)
          document.body.classList.toggle('dark', a);
        }
      }
    })
  }

  toggleTheme(e) {
    if (e.detail.checked) {
      this.darkMode = true;
      GlobaldataService.darkMode = true;
      this.storage.setObject('darkMode', true)
      document.body.classList.toggle('dark', e.detail.checked);
    } else {
      this.darkMode = false;
      GlobaldataService.darkMode = false;
      this.storage.setObject('darkMode', false)
      document.body.classList.toggle('dark', e.detail.checked);
    }
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.storage.clear();
            this.storage.setObject('darkMode', this.darkMode)
            GlobaldataService.clearGobal();
            this.profile = undefined;
            this.general.goToPage('login');
            this.general.toggleMenu();
          }
        }
      ]
    });

    await alert.present();
  }


}
