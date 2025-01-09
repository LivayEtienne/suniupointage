import { TestBed } from '@angular/core/testing';

import { AsignSocketService } from './asign-socket.service';

describe('AsignSocketService', () => {
  let service: AsignSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
