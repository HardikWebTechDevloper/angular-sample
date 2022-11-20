import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpSingleItemComponent } from './sp-single-item.component';

describe('SpSingleItemComponent', () => {
  let component: SpSingleItemComponent;
  let fixture: ComponentFixture<SpSingleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpSingleItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpSingleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
