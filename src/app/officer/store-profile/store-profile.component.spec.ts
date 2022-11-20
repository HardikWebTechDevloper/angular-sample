import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { OfficerStoreprofileService } from '@app/services/officer-storeprofile.service';

import { StoreProfileComponent } from './store-profile.component';

describe('StoreProfileComponent', () => {
  let component: StoreProfileComponent;
  let fixture: ComponentFixture<StoreProfileComponent>;
  let route: ActivatedRoute; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreProfileComponent],
      providers:[OfficerStoreprofileService]
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
  it('get queryParam Licensee ID', () => {
route.snapshot.queryParams.LID = 'testParamChanged';
fixture = TestBed.createComponent(StoreProfileComponent);
component = fixture.componentInstance;
fixture.detectChanges();
expect(component.licenseeId).toBe('testParamChanged');
 });
  it('should call OfficerStoreprofileService', () => {
    const storeService = fixture.debugElement.injector.get(OfficerStoreprofileService);
//  storeService.getLicenseeByID()
 });
});
