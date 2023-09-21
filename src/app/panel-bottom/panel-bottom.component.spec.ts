import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBottomComponent } from './panel-bottom.component';

describe('PanelBottomComponent', () => {
  let component: PanelBottomComponent;
  let fixture: ComponentFixture<PanelBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelBottomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
