import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataservicesService } from './dataservices.service';

describe('DataservicesService', () => {
  let service: DataservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DataservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
