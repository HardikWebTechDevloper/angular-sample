import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCnOsComponent } from './sp-cn-os.component';

describe('SpCnOsComponent', () => {
  let component: SpCnOsComponent;
  let fixture: ComponentFixture<SpCnOsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpCnOsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpCnOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
