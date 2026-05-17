import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from './services/user-service';
import { IUser } from './models/models';
import { CommonModule } from '@angular/common';
import { isEmptyObject } from './utils/utils';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  template: 
    `
    @if(loading) {
      <p>loading...</p>
    } @else {
      @for (user of users; track user.id) {
        <div>{{ user.name }}<button (click)="deleteUser(user)">Удалить</button></div>
      } @empty {
        <div>Список пуст</div>
      }
    }
    `,
  styles: ``
})
export class App implements OnInit {
  users: IUser[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка при загрузке пользователей: ' + err.message;
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges()
      }
    });
  }

  createUser(obj: IUser): void {
      this.userService.updateUser(obj).subscribe({
      next: (data) => {
        this.users = [...this.users, data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка при создании пользователя: ' + err.message;
        console.error(err);
      }
    })
  }

  updateUser(obj: IUser): void {
    this.userService.updateUser(obj).subscribe({
      next: (data) => {
        this.users = this.users.map(user => user.id !== data.id ? user : data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка при обновлении пользователя: ' + err.message;
        console.error(err);
      }
    })
  }

  deleteUser(obj: IUser): void {
    this.userService.deleteUser(obj).subscribe({
      next: (data) => {
        if(isEmptyObject(data)) {
          this.users = this.users.filter(user => user.id !== obj.id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка при удалении пользователя: ' + err.message;
        console.error(err);
      }
    })
  }
}
