import { TestBed } from '@angular/core/testing';

import { OperatorLandingGuard } from './operator-landing.guard';

describe('OperatorLandingGuard', () => {
  let guard: OperatorLandingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OperatorLandingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
