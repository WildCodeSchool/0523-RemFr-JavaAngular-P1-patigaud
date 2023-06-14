import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocSpoofComponent } from './geoloc-spoof.component';

describe('GeolocSpoofComponent', () => {
  let component: GeolocSpoofComponent;
  let fixture: ComponentFixture<GeolocSpoofComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeolocSpoofComponent]
    });
    fixture = TestBed.createComponent(GeolocSpoofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
