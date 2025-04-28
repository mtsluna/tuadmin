import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMassiveComponent } from './modal-massive.component';

describe('ModalMassiveComponent', () => {
  let component: ModalMassiveComponent;
  let fixture: ComponentFixture<ModalMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMassiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
