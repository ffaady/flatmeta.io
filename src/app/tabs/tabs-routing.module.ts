import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 't',
    component: TabsPage,
    children: [
      {
        path: 'h/:id/:username',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'myplaces',
        loadChildren: () => import('../pages/myplaces/myplaces.module').then(m => m.MyplacesPageModule)
      },
      {
        path: 'salelist',
        loadChildren: () => import('../pages/salelist/salelist.module').then(m => m.SalelistPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../pages/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'friendrequest',
        loadChildren: () => import('../pages/friendrequest/friendrequest.module').then(m => m.FriendrequestPageModule)
      },
      {
        path: '',
        redirectTo: '/t/h/n/n',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/t/h/n/n',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
