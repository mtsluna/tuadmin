import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCatalogsComponent } from './external-catalogs.component';

describe('ExternalCatalogsComponent', () => {
  let component: ExternalCatalogsComponent;
  let fixture: ComponentFixture<ExternalCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalCatalogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
