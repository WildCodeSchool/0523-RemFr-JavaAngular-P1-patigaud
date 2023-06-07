import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotidexComponent } from './potidex.component';

describe('PotidexComponent', () => {
  let component: PotidexComponent;
  let fixture: ComponentFixture<PotidexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PotidexComponent]
    });
    fixture = TestBed.createComponent(PotidexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
