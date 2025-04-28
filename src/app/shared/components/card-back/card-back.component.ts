import {Component, Input} from '@angular/core';
import {GiftCard} from '../../../pages/giftcards/giftcards.component';

@Component({
  selector: 'app-card-back',
  imports: [],
  templateUrl: './card-back.component.svg',
  standalone: true,
  styleUrl: './card-back.component.scss'
})
export class CardBackComponent {
  @Input() giftcard: GiftCard = {} as GiftCard;
  @Input() id: string = 'modal-back';

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
