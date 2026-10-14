import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { Store } from '../services/store';
import { adminOnlyGuard, authGuard } from './auth-guard';

describe('Guards: authGuard & adminOnlyGuard (core/guards)', () => {
  let store: Store;
  let router: Router;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('permite navegación cuando hay usuario autenticado', () => {
      store.login('cajero1', 'cajero');

      const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(result).toBe(true);
    });

    it('redirige a /login cuando no hay sesión activa', () => {
      store.logout();

      const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(result).toEqual(router.createUrlTree(['/login']));
    });
  });

  describe('adminOnlyGuard', () => {
    it('permite navegación a administradores', () => {
      store.login('admin1', 'admin');

      const result = TestBed.runInInjectionContext(() => adminOnlyGuard({} as any, {} as any));
      expect(result).toBe(true);
    });

    it('redirige a /pos si el usuario es cajero', () => {
      store.login('cajero1', 'cajero');

      const result = TestBed.runInInjectionContext(() => adminOnlyGuard({} as any, {} as any));
      expect(result).toEqual(router.createUrlTree(['/pos']));
    });
  });
});
