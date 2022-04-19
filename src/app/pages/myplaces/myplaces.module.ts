import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyplacesPageRoutingModule } from './myplaces-routing.module';

import { MyplacesPage } from './myplaces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyplacesPageRoutingModule
  ],
  declarations: [MyplacesPage]
})
export class MyplacesPageModule {}
