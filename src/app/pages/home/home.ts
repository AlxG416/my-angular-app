import { Component, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { UsersFilterComponent } from '../../components/users-filter/users-filter';
import { UsersTableComponent } from '../../components/users-table/users-table';
import { PaginationComponent } from '../../components/pagination/pagination';
import { ModalButtonComponent } from '../../components/modal-button/modal-button';
import { UserFormComponent } from '../../components/user-form/user-form';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user-service';
import { IUser, userPattern } from '../../models/models';
import { deepMerge } from '../../utils/utils';

@Component({
  selector: 'home-page',
  imports: [
    CommonModule, 
    FormsModule,
    NzSpinModule,
    NzButtonModule,
    NzFlexModule,
    NzAlertModule,
    UsersFilterComponent,
    PaginationComponent,
    UsersTableComponent,
    UserFormComponent,
    ModalButtonComponent
  ],
  template: `
    <h2>Список пользователей</h2>

    <!-- 
      Компонент фильтрации таблицы и 
      модальное окно с формой для создания пользователя, 
      открывающееся по кнопке "Создать пользователя"
    -->
    <div nz-flex nzJustify="space-between" nzAlign="center">
      <users-filter
        [users]="users"
        (usersFiltered)="onFilteredUsersReceived($event)"
        [style]="'position: relative; top: 8px; margin-bottom: 20px;'"      
      ></users-filter>
      <modal-button
        buttonText='Создать пользователя'
        modalTitle='Создание пользователя'
      >
        <user-form
          (userFormSubmit)="createUser($event)"
        >
        </user-form>
      </modal-button>
    </div>

    <!-- Статистика -->
    <div class="stats">
      Найдено: {{ users.length }} пользователей
    </div>

    <!-- Таблица пользователей -->
    <users-table
      *ngIf="!loading && users.length > 0"
      [users]="paginatedUsers"
    >
    </users-table>
    
    <!-- Пагинация -->
    <pagination
      [users]="filteredUsers"
      (usersPaginated)="onPaginatedUsersReceived($event)"
    ></pagination>

    <!-- 
      Если пользователи не найдены после применения фильтра,
      высвятится сообщение.
    -->
    <div *ngIf="filteredUsers.length === 0 && !loading && !error">
      <h3>Пользователи с таким запросом не найдены</h3>
    </div>

    <!-- Состояние загрузки пользователей -->
    <div class="loading-state" *ngIf="loading">
      <nz-spin nzSimple nzSize="large" />
      <p>Загрузка пользователей...</p>
    </div>

    <!-- Обработка ошибки при загрузки пользователей -->
    <nz-alert 
      nzType="error" 
      nzMessage="Ошибка" 
      [nzDescription]="error" 
      nzShowIcon
      *ngIf="error"
    />
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
export class HomePage implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);
  private readonly message = inject(NzMessageService);
  private destroy$ = new Subject<void>();

  public users: IUser[] = [];
  public paginatedUsers: IUser[] = [];
  public filteredUsers: IUser[] = [];
  
  public loading: boolean = false;
  public error: null | string = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    /* 
      Проверяем, были ли получены пользователи по API.
      Если нет, то получаем users по API, 
      иначе достаем их из localStorage
    */
    if(this.userService.wasGetAllUsersAPIExecuted) {
      const users = this.userService.getAllUsers();
      this.users = users;
      this.paginatedUsers = users.slice(0, 5);
      this.filteredUsers = users;
      this.cdr.detectChanges();
    } else {
      this.loading = true;
      this.error = null;
      this.userService.getAllUsersAPI()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (usersData) => {
            localStorage.setItem('users', JSON.stringify(usersData));
            this.users = usersData;
            this.paginatedUsers = usersData.slice(0, 5);
            this.filteredUsers = usersData;
            setTimeout(() => {
              this.loading = false;
              this.cdr.detectChanges()
            }, 2000)
          },
          error: (err) => {
            this.loading = false;
            this.error = err.message;
            console.error(err);
            this.cdr.detectChanges();
          }
        });
      this.userService.wasGetAllUsersAPIExecuted = true;
    }
  }

  /* 
    Запускается каждый раз, 
    когда прилетают данные из формы 
    для создания пользователя 
  */
  createUser(userData: Partial<IUser>): void { // Добавить запрос на сервер для галочки
    const newUser = this.userService.createUser(deepMerge(userPattern, userData));
    this.message.create('success', 'Пользователь создан');
    this.users = [...this.users, newUser];
    this.paginatedUsers = this.users.slice(0, 5);
    this.filteredUsers = this.users;
  }

  onPaginatedUsersReceived(users: IUser[]) {
    this.paginatedUsers = users;
    this.cdr.detectChanges()
  }

  onFilteredUsersReceived(users: IUser[]){
    this.filteredUsers = users;
    this.cdr.detectChanges();
  }
}
