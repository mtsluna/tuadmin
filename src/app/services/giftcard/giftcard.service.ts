import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SortDirection} from '@angular/material/sort';
import {Observable} from 'rxjs';
import {GithubApi} from '../../pages/giftcards/giftcards.component';

@Injectable({
  providedIn: 'root'
})
export class GiftCardService {

  url = 'http://localhost:3000/api/gift-cards';

  constructor(private _httpClient: HttpClient) {}

  getGiftCards(sort: string, order: SortDirection, page: number, search: string): Observable<GithubApi> {
    return this._httpClient.get<GithubApi>(this.url, {
      params: {
        ...(search ? { search } : {})
      } as unknown as HttpParams
    });
  }

  deleteGiftCard(id: string): Observable<any> {
    return this._httpClient.delete<GithubApi>(this.url+`/${id}`);
  }

  createGiftCard(giftCard: any): Observable<any> {
    return this._httpClient.post<GithubApi>(this.url, giftCard);
  }

  updateGiftCard(giftCard: any): Observable<any> {
    return this._httpClient.put<GithubApi>(this.url+`/${giftCard.id}`, giftCard);
  }
}
