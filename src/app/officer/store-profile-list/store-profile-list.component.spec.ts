import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProfileListComponent } from './store-profile-list.component';

describe('StoreProfileListComponent', () => {
  let component: StoreProfileListComponent;
  let fixture: ComponentFixture<StoreProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreProfileListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
