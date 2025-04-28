import {Component, inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel, MatPrefix} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardComponent} from '../../../shared/components/card/card.component';
import {GiftCard} from '../giftcards.component';
import {GiftCardService} from '../../../services/giftcard/giftcard.service';
import {CardBackComponent} from '../../../shared/components/card-back/card-back.component';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatLabel,
    MatDialogTitle,
    ReactiveFormsModule,
    CardComponent,
    MatPrefix,
    CardBackComponent
  ],
  templateUrl: './modal-massive.component.html',
  standalone: true,
  styleUrl: './modal-massive.component.scss'
})
export class ModalMassiveComponent {

  readonly dialogRef = inject(MatDialogRef<ModalMassiveComponent>);
  readonly data = inject<GiftCard>(MAT_DIALOG_DATA);
  readonly giftCardService = inject(GiftCardService);

  readonly formGroup = new FormGroup({
    type: new FormControl('Black', [ Validators.required ]),
    balance: new FormControl(25000, [ Validators.required ]),
    quantity: new FormControl(0, [ Validators.required ])
  })

  generateNewCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generate = () =>
      Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

    return `${generate()}-${generate()}`;
  }

  create() {
    const { quantity, type, balance } = this.formGroup.getRawValue() as { quantity: number, balance: number, type: string };

    const observables = Array.from({ length: quantity }).map(() => {
      return this.giftCardService.createGiftCard({
        code: this.generateNewCode(),
        type,
        balance,
      })
    });

    forkJoin(observables).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
