import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpTableComponent } from './sp-table.component';

describe('SpTableComponent', () => {
  let component: SpTableComponent;
  let fixture: ComponentFixture<SpTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
