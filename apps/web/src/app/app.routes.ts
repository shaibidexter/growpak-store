import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'crop/:slug',
    loadComponent: () => import('./features/shop/crop-filter.component').then((m) => m.CropFilterComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
