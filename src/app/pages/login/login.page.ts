import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { StorageService } from '../../providers/storage.service';
import { GeneralService } from '../../providers/general.service';
import { GlobaldataService } from '../../providers/globaldata.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from 'src/app/providers/http.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPass: boolean = false;
  loading: boolean = false;

  constructor(
    public general: GeneralService,
    public formBuilder: FormBuilder,
    private storage: StorageService,
    public http: HttpService,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email_address: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]]
    })
  }

  get getLoginControl() {
    return this.loginForm.controls;
  }

  onKeydown(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      return
    };
    this.loading = true;
    this.http.post2('AppLogin', this.loginForm.value, false).subscribe((res: any) => {
      if (res.status == true) {
        this.loading = false;
        this.storage.setObject('userObject', res.data);
        GlobaldataService.userObject = res.data;
        this.events.publishLogin(res.data)
        this.general.goToPage('tabs/home');
      } else {
        this.loading = false;
        this.general.presentToast(res.message);
      }
    }, (e) => {
      console.log(e)
    })
  }


}
