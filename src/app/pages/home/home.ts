import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UsersFilterComponent } from '../../components/users-filter/users-filter';
import { UsersTableComponent } from '../../components/users-table/users-table';
import { UserFormModalComponent } from '../../components/user-form-modal/user-form-modal';
import { PaginationComponent } from '../../components/pagination/pagination';

import { UserService } from '../../services/user-service';
import { IUser, userPattern } from '../../models/models';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'home-page',
  imports: [
    CommonModule, 
    FormsModule,
    NzSpinModule,
    NzButtonModule,
    NzFlexModule,
    UsersFilterComponent,
    PaginationComponent,
    UsersTableComponent,
    UserFormModalComponent
  ],
  template: `
    <h2>Список пользователей</h2>
    <div nz-flex nzJustify="space-between" nzAlign="center">
      <users-filter
        [users]="users"
        (returnFilteredUsers)="onFilteredUsersReceived($event)"      
      ></users-filter>
      <button nz-button (click)="showModal()">Создать пользователя</button>
    </div>
    <!-- Статистика -->
    <div class="stats">
      Найдено: {{ users.length }} пользователей
    </div>
    @if(!loading) {
      <users-table
        *ngIf="users.length > 0"
        [users]="paginatedUsers"
      ></users-table>
    } @else {
      <div class="loading-state" *ngIf="!error">
        <nz-spin nzSimple nzSize="large" />
        <p>Загрузка пользователей...</p>
      </div>
    }

    <!-- Пагинация -->
    <pagination
      [users]="filteredUsers"
      (returnPaginatedUsers)="onPaginatedUsersReceived($event)"
    ></pagination>
    
    <user-form-modal
      [isVisible]="isModalVisible"
      (closeModal)="closeModal()"
      (submitModal)="createUser($event)"
    >
    </user-form-modal>
  `,
  styles: `
    .stats {
      background: #e3f2fd;
      padding: 8px 15px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #1976d2;
      display: inline-block;
    }
    .loading-state {
      text-align: center;
      padding: 40px;
    }
  `
})
export class HomePage implements OnInit {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  paginatedUsers: IUser[] = [];
  paginationUsers: IUser[] = [];
  
  loading: boolean = false;
  error: string | null = null;

  isModalVisible: boolean = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const users = this.userService.getAllUsers();
    
    if(this.userService.wasGetAllUsersAPIExecuted || users.length > 0) {
      this.users = users;
      this.paginatedUsers = users.slice(0, 5);
      this.filteredUsers = users;
      this.cdr.detectChanges();
    } else {
      this.loading = true;
      this.error = null;

      this.userService.getAllUsersAPI().subscribe({
        next: (data) => {
          localStorage.setItem('users', JSON.stringify(data));
          this.users = data;
          this.paginatedUsers = data.slice(0, 5);
          this.filteredUsers = this.users;
        },
        error: (err) => {
          this.error = 'Ошибка при загрузке пользователей: ' + err.message;
          console.error(err);
        }
      });
      this.userService.wasGetAllUsersAPIExecuted = true;

      setTimeout(() => {
        this.loading = false;
        this.cdr.detectChanges()
      }, 2000)
    }
  }

  createUser(userData: Partial<IUser>): void { // Доработать
    const newUser = this.userService.createUser({...userPattern, ...userData});
    if(!newUser) {
      this.createMessage('error', 'Произошла ошибка');
    } else {
      this.createMessage('success', 'Пользователь создан')
      this.users = [...this.users, newUser];
      this.paginatedUsers = this.users.slice(0, 5);
      this.filteredUsers = this.users;
    }
    this.isModalVisible = false;
  }

  onPaginatedUsersReceived(users: IUser[]) {
    this.paginatedUsers = users;
    this.cdr.detectChanges()
  }

  onFilteredUsersReceived(users: IUser[]){
    this.filteredUsers = users;
    this.cdr.detectChanges();
  }

  showModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, `${message}`);
  }
}
