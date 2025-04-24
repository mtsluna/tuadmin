import { Routes } from '@angular/router';
import {GiftcardsComponent} from './pages/giftcards/giftcards.component';
import {LoginComponent} from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'giftcards',
    component: GiftcardsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];
