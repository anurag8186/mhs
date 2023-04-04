import { TestBed } from '@angular/core/testing';

import { PreviewEmailService } from './preview-email.service';

describe('PreviewEmailService', () => {
  let service: PreviewEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
