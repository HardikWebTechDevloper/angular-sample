import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConfimationComponent } from './purchase-confimation.component';

describe('PurchaseConfimationComponent', () => {
  let component: PurchaseConfimationComponent;
  let fixture: ComponentFixture<PurchaseConfimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseConfimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseConfimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
