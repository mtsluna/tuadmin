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
    MatPrefix
  ],
  templateUrl: './modal.component.html',
  standalone: true,
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<ModalComponent>);
  readonly data = inject<GiftCard>(MAT_DIALOG_DATA);
  readonly giftCardService = inject(GiftCardService);

  readonly formGroup = new FormGroup({
    id: new FormControl(this.data?.id, [ Validators.required ]),
    code: new FormControl(this.generateNewCode(), [ Validators.required ]),
    type: new FormControl('Black', [ Validators.required ]),
    balance: new FormControl(25000, [ Validators.required ]),
    owner: new FormControl('', [])
  })

  ngOnInit(): void {
    this.formGroup.patchValue(this.data);

    if(this.data.code) {
      this.formGroup.get('code')?.disable();
      this.formGroup.get('type')?.disable();
    }
  }

  generateNewCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generate = () =>
      Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

    return `${generate()}-${generate()}`;
  }

  getFormValue() {
    return this.formGroup.getRawValue() as GiftCard;
  }

  delete() {
    const { id } = this.formGroup.getRawValue() as GiftCard;
    this.giftCardService.deleteGiftCard(id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  create() {
    const { id, ...rest } = this.formGroup.getRawValue() as GiftCard;
    this.giftCardService.createGiftCard({
      ...rest,
      owner: rest.owner ? rest.owner : undefined,
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  update() {
    const { id, ...rest } = this.formGroup.getRawValue() as GiftCard;
    this.giftCardService.updateGiftCard({
      id,
      ...rest,
      owner: rest.owner ? rest.owner : undefined,
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
