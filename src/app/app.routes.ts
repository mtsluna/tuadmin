import { Routes } from '@angular/router';
import {GiftcardsComponent} from './pages/giftcards/giftcards.component';
import {LoginComponent} from './pages/login/login.component';
import {ExternalCatalogsComponent} from './pages/external-catalogs/external-catalogs.component';

export const routes: Routes = [
  {
    path: 'giftcards',
    component: GiftcardsComponent,
  },
  {
    path: 'external-catalogs',
    component: ExternalCatalogsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];
