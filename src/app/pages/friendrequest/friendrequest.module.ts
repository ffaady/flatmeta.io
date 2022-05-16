import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendrequestPageRoutingModule } from './friendrequest-routing.module';

import { FriendrequestPage } from './friendrequest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendrequestPageRoutingModule
  ],
  declarations: [FriendrequestPage]
})
export class FriendrequestPageModule {}
