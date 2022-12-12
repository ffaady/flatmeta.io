import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpensourcePageRoutingModule } from './opensource-routing.module';

import { OpensourcePage } from './opensource.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpensourcePageRoutingModule
  ],
  declarations: [OpensourcePage]
})
export class OpensourcePageModule {}
