import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poderes } from './poderes';

describe('Poderes', () => {
  let component: Poderes;
  let fixture: ComponentFixture<Poderes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Poderes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Poderes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
