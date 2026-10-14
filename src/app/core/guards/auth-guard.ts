import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Store } from '../services/store';

/**
 * Guard de autenticación: Verifica si hay sesión activa en el Store.
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.currentUser()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

/**
 * Guard de autorización administrativa: Permite el paso solo a administradores.
 */
export const adminOnlyGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const user = store.currentUser();
  if (user && user.role === 'admin') {
    return true;
  }
  return router.createUrlTree(['/pos']);
};
