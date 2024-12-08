import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaRaComponent } from './experiencia-ra.component';

describe('ExperienciaRaComponent', () => {
  let component: ExperienciaRaComponent;
  let fixture: ComponentFixture<ExperienciaRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienciaRaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienciaRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
