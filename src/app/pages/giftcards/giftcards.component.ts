import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HttpClient} from '@angular/common/http';
import {catchError, map, merge, of, startWith, switchMap} from 'rxjs';
import {CurrencyPipe, NgStyle, SlicePipe} from '@angular/common';
import {MatChip, MatChipAvatar} from '@angular/material/chips';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ModalComponent} from './modal/modal.component';
import {MatDialog,} from '@angular/material/dialog';
import {GiftCardService} from '../../services/giftcard/giftcard.service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-giftcards',
  imports: [
    MatPaginator,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatSort,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatRowDef,
    MatProgressSpinner,
    MatChip,
    MatChipAvatar,
    NgStyle,
    CurrencyPipe,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatButton,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    SlicePipe,
    MatProgressBar,
  ],
  templateUrl: './giftcards.component.html',
  standalone: true,
  styleUrl: './giftcards.component.scss'
})
export class GiftcardsComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private giftCardService = inject(GiftCardService);
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['code', 'balance', 'owner'];
  data: GiftCard[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  filter = '';

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  applyFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
    this.loadData();
  }

  openDetail(row: GiftCard | undefined) {

    const dialogRef = this.dialog.open(ModalComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.giftCardService!.getGiftCards(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.filter
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.pagination.total_records;
          return data.data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  protected readonly console = console;
}

export interface GithubApi {
  data: GiftCard[];
  pagination: {
    total_records: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface GiftCard {
  id: string;
  code: string;
  type: string;
  balance: number;
  owner: string;
}
