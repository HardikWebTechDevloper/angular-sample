import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProfileComponent } from './store-profile.component';

describe('StoreProfileComponent', () => {
  let component: StoreProfileComponent;
  let fixture: ComponentFixture<StoreProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a _buildForm method', () => {
    expect(component._buildForm).toBe('function');
  });
  it('should have a getLicenseeById method', () => {
    expect(component.getLicenseeById).toBe('function');
  });
});
