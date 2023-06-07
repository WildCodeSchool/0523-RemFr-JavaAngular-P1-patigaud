import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatidexComponent } from './patidex.component';

describe('PatidexComponent', () => {
  let component: PatidexComponent;
  let fixture: ComponentFixture<PatidexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatidexComponent]
    });
    fixture = TestBed.createComponent(PatidexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
