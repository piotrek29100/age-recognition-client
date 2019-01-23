import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandscapeViewComponent } from './landscape-view.component';

describe('LandscapeViewComponent', () => {
  let component: LandscapeViewComponent;
  let fixture: ComponentFixture<LandscapeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandscapeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandscapeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
