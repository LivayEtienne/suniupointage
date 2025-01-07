import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierApprenantComponent } from './modifier-apprenant.component';

describe('ModifierApprenantComponent', () => {
  let component: ModifierApprenantComponent;
  let fixture: ComponentFixture<ModifierApprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierApprenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
