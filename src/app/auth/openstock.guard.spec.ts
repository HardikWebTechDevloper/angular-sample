import { TestBed } from '@angular/core/testing';

import { OpenstockGuard } from './openstock.guard';

describe('OpenstockGuard', () => {
  let guard: OpenstockGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpenstockGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
