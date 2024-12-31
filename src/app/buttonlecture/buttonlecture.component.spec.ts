import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonlectureComponent } from './buttonlecture.component';

describe('ButtonlectureComponent', () => {
  let component: ButtonlectureComponent;
  let fixture: ComponentFixture<ButtonlectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonlectureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonlectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
