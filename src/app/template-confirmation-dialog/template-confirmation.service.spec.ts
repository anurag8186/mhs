import { TestBed } from '@angular/core/testing';

import { TemplateConfirmationService } from './template-confirmation.service';

describe('TemplateConfirmationService', () => {
  let service: TemplateConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
