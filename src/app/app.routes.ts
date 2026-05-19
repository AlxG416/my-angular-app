import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home';
import { UsersDetailPage } from './pages/user-detail/user-detail';

export const routes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'users', component: HomePage },
    { path: 'user-details/:id', component: UsersDetailPage },
];
