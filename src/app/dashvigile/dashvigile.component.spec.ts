import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashvigileComponent } from './dashvigile.component';

describe('DashvigileComponent', () => {
  let component: DashvigileComponent;
  let fixture: ComponentFixture<DashvigileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashvigileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashvigileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
