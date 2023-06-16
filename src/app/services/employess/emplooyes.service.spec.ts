import { TestBed } from '@angular/core/testing';

import { EmplooyesService } from './emplooyes.service';

describe('EmplooyesService', () => {
  let service: EmplooyesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmplooyesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
