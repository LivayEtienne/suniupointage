import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilCohorteComponent } from './accueil-cohorte.component';

describe('AccueilCohorteComponent', () => {
  let component: AccueilCohorteComponent;
  let fixture: ComponentFixture<AccueilCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
