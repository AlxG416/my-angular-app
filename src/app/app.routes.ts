import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home';
import { UserDetailPage } from './pages/user-detail/user-detail';

export const routes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'users', component: HomePage },
    { path: 'user-details/:id', component: UserDetailPage },
    { path: '**', redirectTo: '/users' }
];
