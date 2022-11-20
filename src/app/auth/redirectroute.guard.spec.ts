import { TestBed } from '@angular/core/testing';

import { RedirectrouteGuard } from './redirectroute.guard';

describe('RedirectrouteGuard', () => {
  let guard: RedirectrouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectrouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
