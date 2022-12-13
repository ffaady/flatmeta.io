import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentpurchasesPageRoutingModule } from './recentpurchases-routing.module';

import { RecentpurchasesPage } from './recentpurchases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentpurchasesPageRoutingModule
  ],
  declarations: [RecentpurchasesPage]
})
export class RecentpurchasesPageModule {}
