import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendrequestPage } from './friendrequest.page';

const routes: Routes = [
  {
    path: '',
    component: FriendrequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendrequestPageRoutingModule {}
