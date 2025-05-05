import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SortDirection} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {GithubApi} from '../../pages/external-catalogs/external-catalogs.component';

@Injectable({
  providedIn: 'root'
})
export class ExternalCatalogsService {

  url = 'https://tuadmin-api-production.up.railway.app/api/external-catalogs';

  constructor(private _httpClient: HttpClient) {}

  getGiftCards(sort: string, order: SortDirection, page: number, search: string): Observable<GithubApi> {
    return this._httpClient.get<GithubApi>(this.url, {
      params: {
        ...(search ? { search } : {}),
        size: 100
      } as unknown as HttpParams
    });
  }

  createGiftCard(giftCard: any): Observable<any> {
    return this._httpClient.post<GithubApi>(this.url, giftCard);
  }
}
