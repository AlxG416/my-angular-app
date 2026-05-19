import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
          <td>{{user.id}}</td>
          <td>
            <strong>{{user.name}}</strong><br/>
            <small>@{{user.username}}</small>
          </td>
          <td>
            <a>{{user.email || 'Не указан'}}</a>
          </td>
          <td>{{user.phone || 'Телефон не указан'}}</td>
          <td>{{user.company && user.company.name || 'Название компании не указано'}}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: ``
})
export class UsersTableComponent implements OnInit, OnChanges {
  @Input() users: IUser[] = [];

  ngOnInit() {
    console.log('On Init: ', this.users)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('Предыдущее значение: ', changes['users'].previousValue);
    // console.log('Текущее значение: ', changes['users'].currentValue);
    // console.log('Первое изменение: ', changes['users'].firstChange);
  }
}
