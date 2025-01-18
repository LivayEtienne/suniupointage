import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpointageComponent } from './testpointage.component';

describe('TestpointageComponent', () => {
  let component: TestpointageComponent;
  let fixture: ComponentFixture<TestpointageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestpointageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestpointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
