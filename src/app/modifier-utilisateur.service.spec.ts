import { TestBed } from '@angular/core/testing';

import { ModifierUtilisateurService } from './modifier-utilisateur.service';

describe('ModifierUtilisateurService', () => {
  let service: ModifierUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifierUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
