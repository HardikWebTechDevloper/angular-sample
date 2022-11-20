import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastExerciseRegisterComponent } from './past-exercise-register.component';

describe('PastExerciseRegisterComponent', () => {
  let component: PastExerciseRegisterComponent;
  let fixture: ComponentFixture<PastExerciseRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PastExerciseRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastExerciseRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
