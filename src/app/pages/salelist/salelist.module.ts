import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalelistPageRoutingModule } from './salelist-routing.module';

import { SalelistPage } from './salelist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalelistPageRoutingModule
  ],
  declarations: [SalelistPage]
})
export class SalelistPageModule {}
