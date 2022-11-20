import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTabsComponent } from './reg-tabs.component';

describe('RegTabsComponent', () => {
  let component: RegTabsComponent;
  let fixture: ComponentFixture<RegTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegTabsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
