import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewresponseDialogComponent } from './viewresponse-dialog.component';

describe('ViewresponseDialogComponent', () => {
  let component: ViewresponseDialogComponent;
  let fixture: ComponentFixture<ViewresponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewresponseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewresponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
