import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacoesTabComponent } from './observacoes-tab.component';

describe('ObservacoesTabComponent', () => {
  let component: ObservacoesTabComponent;
  let fixture: ComponentFixture<ObservacoesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservacoesTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacoesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
