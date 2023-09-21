import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentidadeTabComponent } from './identidade-tab.component';

describe('IdentidadeTabComponent', () => {
  let component: IdentidadeTabComponent;
  let fixture: ComponentFixture<IdentidadeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentidadeTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentidadeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
