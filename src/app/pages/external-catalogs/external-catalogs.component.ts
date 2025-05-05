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
import {CurrencyPipe, JsonPipe, NgStyle, SlicePipe} from '@angular/common';
import {MatChip, MatChipAvatar} from '@angular/material/chips';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDialog,} from '@angular/material/dialog';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatIcon} from '@angular/material/icon';
import {CardComponent} from '../../shared/components/card/card.component';
import {CardBackComponent} from "../../shared/components/card-back/card-back.component";
import {ModalComponent} from '../giftcards/modal/modal.component';
import {ExternalCatalogsService} from '../../services/external-catalogs/external-catalogs.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-external-catalogs',
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
    MatIcon,
    MatMiniFabButton,
    MatFabButton,
    MatIconButton,
    CardComponent,
    CardBackComponent,
    JsonPipe,
    RouterLink,
  ],
  templateUrl: './external-catalogs.component.html',
  standalone: true,
  styleUrl: './external-catalogs.component.scss'
})
export class ExternalCatalogsComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  router = inject(Router);
  private externalCatalogService = inject(ExternalCatalogsService);
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['sku', 'name', 'mercado_libre_id'];
  data: ExternalCatalog[] = [];

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

  openDetail(row: ExternalCatalog | undefined) {

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
          return this.externalCatalogService!.getGiftCards(
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
  protected readonly window = window;
}

export interface GithubApi {
  data: ExternalCatalog[];
  pagination: {
    total_records: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface ExternalCatalog {
  id: string;
  sku: string;
  name: string;
  mercado_libre_id: string;
}
