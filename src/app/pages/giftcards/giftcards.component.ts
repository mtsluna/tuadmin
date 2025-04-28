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
import {ModalComponent} from './modal/modal.component';
import {MatDialog,} from '@angular/material/dialog';
import {GiftCardService} from '../../services/giftcard/giftcard.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatIcon} from '@angular/material/icon';
import jspdf from 'jspdf';
import {CardComponent} from '../../shared/components/card/card.component';
import {CardBackComponent} from "../../shared/components/card-back/card-back.component";
import {ModalMassiveComponent} from './modal-massive/modal-massive.component';

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
    MatIcon,
    MatMiniFabButton,
    MatFabButton,
    MatIconButton,
    CardComponent,
    CardBackComponent,
    JsonPipe,
  ],
  templateUrl: './giftcards.component.html',
  standalone: true,
  styleUrl: './giftcards.component.scss'
})
export class GiftcardsComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private giftCardService = inject(GiftCardService);
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['code', 'balance', 'owner', 'actions'];
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

  openMassive() {
    const dialogRef = this.dialog.open(ModalMassiveComponent);

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

  downloadAll() {
    this.data.forEach((row) => {
      this.downloadCard(row);
    });
  }

  downloadCard(row: GiftCard) {

    console.log(row);

    const svgElement = document.getElementById('svg_table_' + row?.code) as unknown as SVGSVGElement;
    const svgElementBack = document.getElementById('svg_table_back_' + row?.code) as unknown as SVGSVGElement;

    if (!svgElement || !svgElementBack) {
      console.error('SVG not found');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgDataBack = new XMLSerializer().serializeToString(svgElementBack);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      canvas.width = 850;
      canvas.height = 550;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pdf = new jspdf({
        orientation: 'landscape',
        unit: 'cm',
        format: [8.5, 5.5],
      });

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 5.5);

      pdf.addPage();

      const imgBack = new Image();
      imgBack.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgBack, 0, 0, canvas.width, canvas.height);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 5.5);
        pdf.save(`giftcard-${row.code}.pdf`);
      };
      imgBack.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgDataBack)));
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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
