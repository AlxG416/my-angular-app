import { Routes } from '@angular/router';

//import { HomePage } from './pages/home/home';
//import { UserDetailPage } from './pages/user-detail/user-detail';

export const routes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    {
        path: 'users', 
        loadComponent: () => import('./pages/home/home').then(m => m.HomePage)
    },
    { 
        path: 'user-details/:id', 
        loadComponent: () => import('./pages/user-detail/user-detail').then(m => m.UserDetailPage)
    },
    { path: '**', redirectTo: '/users' }
];

// export const routes: Routes = [
//     { path: '', redirectTo: '/users', pathMatch: 'full' },
//     { path: 'users', component: HomePage },
//     { path: 'user-details/:id', component: UserDetailPage },
//     { path: '**', redirectTo: '/users' }
// ];