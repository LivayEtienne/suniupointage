import { TestBed } from '@angular/core/testing';

import { DashvigileService } from './dashvigile.service';

describe('DashvigileService', () => {
  let service: DashvigileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashvigileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
