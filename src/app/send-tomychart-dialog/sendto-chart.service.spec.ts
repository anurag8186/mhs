import { TestBed } from '@angular/core/testing';

import { SendtoChartService } from './sendto-chart.service';

describe('SendtoChartService', () => {
  let service: SendtoChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendtoChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
