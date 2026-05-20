import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NzTableModule } from 'ng-zorro-antd/table';

import { IUser } from '../../models/models';

@Component({
  selector: 'users-table',
  imports: [
    CommonModule,
    RouterLink,
    NzTableModule
  ],
  template: `
    <nz-table
      #basicTable
      [nzData]="users"
      [nzShowPagination]="false"
      *ngIf="users.length > 0"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Компания</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          *ngFor="let user of basicTable.data" 
          [routerLink]="['/user-details', user.id]" 
          style="cursor: pointer;"
        >
          <td>{{user.id}}</td> <!-- Поле для user обязательно -->
          <td>
            <strong>{{user.name}}</strong><br/> <!-- Поле для user обязательно -->
            <small>@{{user.username}}</small> <!-- Поле для user обязательно -->
          </td>
          <td>
            <a>{{user.email}}</a> <!-- Поле для user обязательно -->
          </td>
          <td>{{user.phone || 'Телефон не указан'}}</td>
          <td>{{user.company && user.company.name || 'Название компании не указано'}}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: ``
})
export class UsersTableComponent {
  @Input() users: IUser[] = [];
}
