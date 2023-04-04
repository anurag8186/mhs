import { TestBed } from '@angular/core/testing';

import { GetjsondataService } from './getjsondata.service';

describe('GetjsondataService', () => {
  let service: GetjsondataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetjsondataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
