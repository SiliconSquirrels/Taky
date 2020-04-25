import { TestBed } from '@angular/core/testing';

import { RemoteServerManagerService } from './remote-server-manager.service';

describe('RemoteServerManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteServerManagerService = TestBed.get(RemoteServerManagerService);
    expect(service).toBeTruthy();
  });
});
