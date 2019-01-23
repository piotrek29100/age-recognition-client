import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraitViewComponent } from './portrait-view.component';

describe('PortraitViewComponent', () => {
  let component: PortraitViewComponent;
  let fixture: ComponentFixture<PortraitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortraitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortraitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
