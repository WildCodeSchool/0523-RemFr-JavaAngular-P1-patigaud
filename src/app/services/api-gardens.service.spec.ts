import { TestBed } from '@angular/core/testing';

import { ApiGardenService } from './api-gardens.service';

describe('ApiGardenService', () => {
  let service: ApiGardenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGardenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
