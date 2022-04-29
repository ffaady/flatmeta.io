import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  profileForm: FormGroup;
  profileImg: string = '';

  constructor(
    public general: GeneralService,
    public http: HttpService,
    public formBuilder: FormBuilder,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.initSignupForm();
  }

  ionViewDidEnter() {
    if (GlobaldataService.userObject != undefined) {
      this.profileForm.patchValue({
        id: GlobaldataService.userObject.id,
        full_name: GlobaldataService.userObject.full_name,
        email_address: GlobaldataService.userObject.email_address,
        user_name: GlobaldataService.userObject.user_name,
        phone_number: GlobaldataService.userObject.phone_number,
        avatar: GlobaldataService.userObject.avatar
      });
      this.profileImg = GlobaldataService.userObject.avatar;
    } else {
      this.general.presentToast('Login to Continue!');
      this.general.goToPage('login');
    }
  }

  initSignupForm() {
    this.profileForm = this.formBuilder.group({
      avatar: '',
      id: '',
      full_name: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      email_address: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone_number: '',
    })
  }

  get getControl() {
    return this.profileForm.controls;
  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  choosePhoto = async (e) => {
    if (e.target.files.length > 0) {
      this.general.presentLoading();
      for (let i = 0; i < e.target.files.length; i++) {
        this.http.uploadImages(e.target.files[i], 'UploadAvatar').subscribe((res: any) => {
          this.general.stopLoading();
          if (res.status == true) {
            this.profileImg = res.data;
            this.profileForm.patchValue({
              avatar: res.data
            })
            this.general.presentToast('Image Uploaded!')
          } else {
            this.general.presentToast(res.data.message);
          }
        }, (e) => {
          this.general.stopLoading();
          console.log(e)
        })
      }
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }
    this.http.post2('UpdateProfile', this.profileForm.value, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.profileForm.patchValue(res.data);
        this.profileImg = res.data.avatar;
        GlobaldataService.userObject = res.data;
        this.storage.setObject('userObject', res.data);
      } else {
        this.general.presentToast(res.message);
      }
    },
      (e) => {
        this.general.stopLoading();
        console.log(e)
      })
  }

}
