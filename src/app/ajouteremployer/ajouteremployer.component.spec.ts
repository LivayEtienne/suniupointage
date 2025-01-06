import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteremployerComponent } from './ajouteremployer.component';

describe('AjouteremployerComponent', () => {
  let component: AjouteremployerComponent;
  let fixture: ComponentFixture<AjouteremployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouteremployerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouteremployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
