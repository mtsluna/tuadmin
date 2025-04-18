import {Component, inject, OnDestroy, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatSidenavContent, MatIconButton, MatSidenavContainer, MatNavList, MatSidenav, MatListItem],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'tuadmin';
  protected readonly fillerNav = [
    {
      name: 'Giftcards',
      path: '/giftcards',
    },
    {
      name: 'Productos',
      path: '/products',
    }
  ];

  protected readonly fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
