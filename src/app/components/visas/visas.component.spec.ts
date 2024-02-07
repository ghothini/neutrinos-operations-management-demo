import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisasComponent } from './visas.component';

describe('VisasComponent', () => {
  let component: VisasComponent;
  let fixture: ComponentFixture<VisasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
