import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorLandingComponent } from './operator-landing.component';

describe('OperatorLandingComponent', () => {
  let component: OperatorLandingComponent;
  let fixture: ComponentFixture<OperatorLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
