import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTomychartDialogComponent } from './send-tomychart-dialog.component';

describe('SendTomychartDialogComponent', () => {
  let component: SendTomychartDialogComponent;
  let fixture: ComponentFixture<SendTomychartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendTomychartDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendTomychartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
