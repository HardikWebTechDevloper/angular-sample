import { TestBed } from '@angular/core/testing';

import { ConfiguarationService } from './configuaration.service';

describe('ConfiguarationService', () => {
  let service: ConfiguarationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguarationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
