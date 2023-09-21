import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirDialogComponent } from './excluir-dialog.component';

describe('ExcluirDialogComponent', () => {
  let component: ExcluirDialogComponent;
  let fixture: ComponentFixture<ExcluirDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcluirDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcluirDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
