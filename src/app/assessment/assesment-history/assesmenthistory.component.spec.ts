import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmenthistoryComponent } from './assesmenthistory.component';

describe('AssesmenthistoryComponent', () => {
  let component: AssesmenthistoryComponent;
  let fixture: ComponentFixture<AssesmenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssesmenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
