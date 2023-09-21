import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PericiasTabComponent } from './pericias-tab.component';

describe('PericiasTabComponent', () => {
  let component: PericiasTabComponent;
  let fixture: ComponentFixture<PericiasTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PericiasTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PericiasTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
