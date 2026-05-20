import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IUser } from '../../models/models';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'user-info',
  imports: [
    CommonModule,
    NzFlexModule
  ],
  template: `
    <div nz-flex [nzGap]="50" *ngIf="user">
      
      <!-- 
        Секция с контактными данными пользователя      
      -->
      <div>
        <h2>Контактные данные</h2>
        Полное имя: {{user.name || 'не указано'}}<br/>
        Имя пользователя: {{user.username || 'не указано'}}<br/>
        Почта: {{user.email || 'не указана'}}<br/>
        Телефон: {{user.phone || 'не указан'}}<br/>
        Сайт: {{user.website || 'не указан'}}
      </div>

      <!-- 
        Секция с информацией о компании      
      -->
      <div *ngIf="user.company">
        <h2>Компания</h2>
        Название: {{user.company.name || 'не указано'}}<br/>
        Слоган: {{user.company.catchPhrase || 'не указан'}}<br/>
        Сфера деятельности: {{user.company.bs || 'не указана'}}<br/>
      </div>

      <!-- 
        Секция с информацией об адресе      
      -->
      <div *ngIf="user.address">
        <h2>Адрес</h2>
        Улица: {{user.address.street || 'не указана'}}<br/>
        Корпус/Строение/Офис: {{user.address.suite || 'поле не указано'}}<br/>
        Город: {{user.address.city || 'не указан'}}<br/>
        Почтовый индекс: {{user.address.zipcode || 'не указан'}}
      </div>

    </div>
  `,
  styles: ``
})
export class UserInfoComponent {
  @Input() user: IUser | undefined;
}
