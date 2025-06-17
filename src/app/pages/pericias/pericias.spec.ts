import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pericias } from './pericias';

describe('Pericias', () => {
  let component: Pericias;
  let fixture: ComponentFixture<Pericias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pericias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pericias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
