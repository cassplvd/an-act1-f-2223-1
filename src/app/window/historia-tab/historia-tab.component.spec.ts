import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaTabComponent } from './historia-tab.component';

describe('HistoriaTabComponent', () => {
  let component: HistoriaTabComponent;
  let fixture: ComponentFixture<HistoriaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriaTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
