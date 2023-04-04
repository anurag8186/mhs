import { TestBed } from '@angular/core/testing';

import { GetResponseService } from './get-response.service';

describe('GetResponseService', () => {
  let service: GetResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
