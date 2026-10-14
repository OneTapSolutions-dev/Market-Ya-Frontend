import { Routes } from '@angular/router';

import { adminOnlyGuard, authGuard } from './core/guards';
import { AppShell } from './ui/templates/app-shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'pos',
        loadComponent: () => import('./features/pos/pos-page').then((m) => m.PosPage),
      },
      {
        path: 'inventory',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/inventory/inventory-page').then((m) => m.InventoryPage),
      },
      {
        path: 'expirations',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/expirations/expirations-page').then((m) => m.ExpirationsPage),
      },
      {
        path: 'movements',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/movements/movements-page').then((m) => m.MovementsPage),
      },
      {
        path: 'cash-closure',
        loadComponent: () => import('./features/cash-closure/cash-closure-page').then((m) => m.CashClosurePage),
      },
      {
        path: 'electronic-documents',
        canActivate: [adminOnlyGuard],
        loadComponent: () =>
          import('./features/electronic-documents/electronic-documents-page').then(
            (m) => m.ElectronicDocumentsPage,
          ),
      },
      {
        path: 'units',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/units/units-page').then((m) => m.UnitsPage),
      },
      {
        path: 'packs',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/packs/packs-page').then((m) => m.PacksPage),
      },
      {
        path: 'reports',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/reports/reports-page').then((m) => m.ReportsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
