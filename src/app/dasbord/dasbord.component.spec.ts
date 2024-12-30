import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasbordComponent } from './dasbord.component';

describe('DasbordComponent', () => {
  let component: DasbordComponent;
  let fixture: ComponentFixture<DasbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
