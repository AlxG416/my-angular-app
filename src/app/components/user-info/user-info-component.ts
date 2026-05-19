import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IUser } from '../../models/models';

@Component({
  selector: 'user-info',
  imports: [CommonModule],
  template: `
    <div>
      <h2>Контактные данные</h2>
      Полное имя: {{user.name || 'Не указано'}}<br/>
      Имя пользователя: {{user.username || 'Не указано'}}<br/>
      Почта: {{user.email || 'Не указана'}}<br/>
      Телефон: {{user.phone || 'Телефон не указан'}}<br/>
    </div>
    <div *ngIf="user.company">
      <h2>Компания</h2>
      Название: {{user.company.name || 'Не указано'}}<br/>
      Слоган: {{user.company.catchPhrase || 'Не указан'}}<br/>
      Сфера деятельности: {{user.company.bs || 'Не указана'}}<br/>
    </div>
    <div *ngIf="user.address">
      <h2>Адрес</h2>
      Улица: {{user.address.street || 'Улица не указана'}}<br/>
      Корпус/Строение/Офис: {{user.address.suite || 'Не указано'}}<br/>
      Город: {{user.address.city || 'Не указан'}}<br/>
      Почтовый индекс: {{user.address.zipcode || 'Не указан'}}
    </div>
  `,
  styles: ``
})
export class UserInfoComponent {
  @Input() user!: IUser;
}
