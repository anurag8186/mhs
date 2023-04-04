import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateConfirmationDialogComponent } from './template-confirmation-dialog.component';

describe('TemplateConfirmationDialogComponent', () => {
  let component: TemplateConfirmationDialogComponent;
  let fixture: ComponentFixture<TemplateConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
