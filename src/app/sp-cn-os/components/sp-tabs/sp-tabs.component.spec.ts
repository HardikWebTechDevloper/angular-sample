import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpTabsComponent } from './sp-tabs.component';

describe('SpTabsComponent', () => {
  let component: SpTabsComponent;
  let fixture: ComponentFixture<SpTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpTabsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
