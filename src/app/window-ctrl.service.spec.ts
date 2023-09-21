import { TestBed } from '@angular/core/testing';

import { WindowCtrlService } from './window-ctrl.service';

describe('WindowCtrlService', () => {
  let service: WindowCtrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowCtrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
