import {AfterViewInit, Component, importProvidersFrom, inject, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {HttpClient} from '@angular/common/http';
import {catchError, map, merge, Observable, of, startWith, switchMap} from 'rxjs';
import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common';
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
  ],
  templateUrl: './giftcards.component.html',
  standalone: true,
  styleUrl: './giftcards.component.scss'
})
export class GiftcardsComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);

  displayedColumns: string[] = ['code', 'balance', 'owner'];
  exampleDatabase: ExampleHttpDatabase | null = new ExampleHttpDatabase(this._httpClient);
  data: GiftCard[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getGiftCards(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
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
  code: string;
  type: string;
  balance: number;
  owner: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getGiftCards(sort: string, order: SortDirection, page: number): Observable<GithubApi> {
    const href = 'https://tutienda.free.beeceptor.com/giftcards';
    const requestUrl = `${href}`;

    return this._httpClient.get<GithubApi>(requestUrl);
  }
}
