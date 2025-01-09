import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignComponent } from './asign.component';

describe('AsignComponent', () => {
  let component: AsignComponent;
  let fixture: ComponentFixture<AsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
