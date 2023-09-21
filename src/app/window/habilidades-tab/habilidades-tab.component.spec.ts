import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilidadesTabComponent } from './habilidades-tab.component';

describe('HabilidadesTabComponent', () => {
  let component: HabilidadesTabComponent;
  let fixture: ComponentFixture<HabilidadesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabilidadesTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabilidadesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
