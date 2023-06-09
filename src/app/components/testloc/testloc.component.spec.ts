import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestlocComponent } from './testloc.component';

describe('TestlocComponent', () => {
  let component: TestlocComponent;
  let fixture: ComponentFixture<TestlocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestlocComponent]
    });
    fixture = TestBed.createComponent(TestlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
