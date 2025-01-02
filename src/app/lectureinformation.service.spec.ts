import { TestBed } from '@angular/core/testing';

import { LectureinformationService } from './lectureinformation.service';

describe('LectureinformationService', () => {
  let service: LectureinformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LectureinformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
