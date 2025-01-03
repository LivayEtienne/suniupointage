import { TestBed } from '@angular/core/testing';

import { Auth1Service } from './auth1.service';

describe('Auth1Service', () => {
  let service: Auth1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
