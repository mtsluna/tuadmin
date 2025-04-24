import {Component, Input} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {GiftCard} from '../../../pages/giftcards/giftcards.component';

@Component({
  selector: 'app-card',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './card.component.svg',
  standalone: true,
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() giftcard: GiftCard = {} as GiftCard;

  types: { [key: string]: { from: string, to: string } } = {
    Black: {
      from: '#282828',
      to: '#0B0B0B'
    },
    Gold: {
      from: '#FFD700',
      to: '#B8860B'
    },
    Silver: {
      from: '#C0C0C0',
      to: '#A9A9A9'
    },
    Bronze: {
      from: '#CD7F32',
      to: '#8C5123'
    },
  }
}
