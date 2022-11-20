import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExciseRegisterComponent } from './excise-register.component';

describe('ExciseRegisterComponent', () => {
  let component: ExciseRegisterComponent;
  let fixture: ComponentFixture<ExciseRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExciseRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExciseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
