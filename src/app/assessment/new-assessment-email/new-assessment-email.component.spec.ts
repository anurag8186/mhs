import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssessmentEmailComponent } from './new-assessment-email.component';

describe('NewAssessmentEmailComponent', () => {
  let component: NewAssessmentEmailComponent;
  let fixture: ComponentFixture<NewAssessmentEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssessmentEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAssessmentEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
