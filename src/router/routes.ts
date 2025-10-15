import { RouteDefinition } from '@open-cells/core/types';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => {
      await import('../pages/home/home-page.js');
    },
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: 'detail-page',
    action: async () => {
      await import('../pages/detail/detail-page.js');
    },
  },
];
