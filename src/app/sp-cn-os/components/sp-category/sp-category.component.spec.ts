import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCategoryComponent } from './sp-category.component';

describe('SpCategoryComponent', () => {
  let component: SpCategoryComponent;
  let fixture: ComponentFixture<SpCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
