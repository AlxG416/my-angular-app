import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface IUser {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  template: 
    `
    @for (user of users; track user.id) {
      <div>{{ user.name }}<button (click)="deleteUser(user)">Удалить</button></div>
    } @empty {
      <div>Список пуст</div>
    }
    `,
  styles: ``
})
export class App {
  users: IUser[] = [{id: 1, name: 'Alex'}, {id: 2, name: 'Nikita'}, {id: 3, name: 'Vlad'}];

  createUser(user: IUser): void {
    this.users.push(user);
  }

  updateUser(obj: IUser): void {
    this.users = this.users.map(user => {
      if(user.id !== obj.id) {
        return user;
      } else {
        return obj;
      }
    });
  }

  deleteUser(obj: IUser): void {
    this.users = this.users.filter(user => user.id !== obj.id);
  }
}

        // <table class="users-table" *ngIf="paginatedUsers.length > 0; else loading">
        //   <thead>
        //     <tr>
        //       <th>ID</th>
        //       <th>Имя</th>
        //       <th>Email</th>
        //       <th>Телефон</th>
        //       <th>Компания</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     <tr *ngFor="let user of paginatedUsers">
        //       <td>{{ user.id }}</td>
        //       <td>
        //         <strong>{{ user.name }}</strong>
        //         <small>@{{ user.username }}</small>
        //       </td>
        //       <td>
        //         <a href="mailto:{{ user.email }}">{{ user.email }}</a>
        //       </td>
        //       <td>{{ user.phone }}</td>
        //       <td>{{ user.company.name }}</td>
        //     </tr>
        //   </tbody>
        // </table>
