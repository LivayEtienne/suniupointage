import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifieremployerComponent } from './modifieremployer.component';

describe('ModifieremployerComponent', () => {
  let component: ModifieremployerComponent;
  let fixture: ComponentFixture<ModifieremployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifieremployerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifieremployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
