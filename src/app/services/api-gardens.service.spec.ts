import { TestBed } from '@angular/core/testing';

import { ApiGardensService } from './api-gardens.service';

describe('ApiGardensService', () => {
  let service: ApiGardensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGardensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
