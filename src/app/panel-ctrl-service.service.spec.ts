import { TestBed } from '@angular/core/testing';

import { PanelCtrlService } from './panel-ctrl-service.service';

describe('PanelCtrlService', () => {
  let service: PanelCtrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelCtrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
