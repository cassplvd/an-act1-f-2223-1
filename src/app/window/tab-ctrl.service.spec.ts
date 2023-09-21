import { TestBed } from '@angular/core/testing';

import { TabCtrlService } from './tab-ctrl.service';

describe('TabCtrlService', () => {
  let service: TabCtrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabCtrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
