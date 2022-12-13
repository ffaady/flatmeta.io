import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'flatmeta',
    component: TabsPage,
    children: [
      {
        path: 'home',
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
        path: 'thankyou',
        loadChildren: () => import('../pages/thankyou/thankyou.module').then(m => m.ThankyouPageModule)
      },
      {
        path: 'opensource',
        loadChildren: () => import('../pages/opensource/opensource.module').then(m => m.OpensourcePageModule)
      },
      {
        path: 'recentpurchases',
        loadChildren: () => import('../pages/recentpurchases/recentpurchases.module').then(m => m.RecentpurchasesPageModule)
      },
      {
        path: '',
        redirectTo: '/flatmeta/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/flatmeta/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
