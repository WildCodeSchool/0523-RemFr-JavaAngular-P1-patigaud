import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCheckComponent } from './background-check.component';

describe('BackgroundCheckComponent', () => {
  let component: BackgroundCheckComponent;
  let fixture: ComponentFixture<BackgroundCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundCheckComponent]
    });
    fixture = TestBed.createComponent(BackgroundCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
