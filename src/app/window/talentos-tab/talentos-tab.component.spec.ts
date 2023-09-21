import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentosTabComponent } from './talentos-tab.component';

describe('TalentosTabComponent', () => {
  let component: TalentosTabComponent;
  let fixture: ComponentFixture<TalentosTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentosTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
