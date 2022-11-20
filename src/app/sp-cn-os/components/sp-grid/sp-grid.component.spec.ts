import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpGridComponent } from './sp-grid.component';

describe('SpGridComponent', () => {
  let component: SpGridComponent;
  let fixture: ComponentFixture<SpGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
