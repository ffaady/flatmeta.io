import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventsService } from 'src/app/providers/events.service';
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
    private storage: StorageService,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.initSignupForm();
    this.events.receiveLogin().subscribe((res: any) => {
      if (res) {
        this.profileForm.patchValue(res);
        this.profileImg = res.user_image;
      }
    })
  }

  ionViewDidEnter() {
    if (GlobaldataService.userObject != undefined) {
      this.profileForm.patchValue({
        user_id: GlobaldataService.userObject.user_id,
        fullname: GlobaldataService.userObject.fullname,
        username: GlobaldataService.userObject.username,
        email: GlobaldataService.userObject.email,
        user_image: GlobaldataService.userObject.user_image
      });
      this.profileImg = GlobaldataService.userObject.user_image;
    }
  }

  initSignupForm() {
    this.profileForm = this.formBuilder.group({
      user_id: '',
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      user_image: ''
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
        this.http.uploadImages(e.target.files[i], 'UploadUserImage').subscribe((res: any) => {
          this.general.stopLoading();
          if (res.status == true) {
            this.profileImg = res.data.user_image;
            this.profileForm.patchValue({
              user_image: res.data.file_name
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
    this.http.post('UpdateUser', this.profileForm.value, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.profileForm.patchValue(res.data);
        this.profileImg = res.data.user_image;
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
