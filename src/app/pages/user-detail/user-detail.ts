import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { UserFormComponent } from '../../components/user-form/user-form';
import { ModalButtonComponent } from '../../components/modal-button/modal-button';
import { UserInfoComponent } from '../../components/user-info/user-info';

import { UserService } from '../../services/user-service';
import { IUser } from '../../models/models';

import { NzDemoFormAutoTipsComponent } from '../../components/hz-form/hz-form';

@Component({
  selector: 'user-detail-page',
  imports: [
    CommonModule, 
    RouterLink, 
    NzFlexModule,
    NzSpaceModule,
    NzButtonModule, 
    NzSpinModule,
    NzAlertModule,
    UserInfoComponent,
    UserFormComponent,
    ModalButtonComponent,
    NzDemoFormAutoTipsComponent
  ],
  template: `
    <!-- Кнопка для возвращения на главную страницу -->
    <button nz-button nzType="link" routerLink="/users">← Вернуться назад</button>

    <!--
      Компонент модального окна с формой 
      для редактирования пользователя, 
      открывающегося по кнопке "Создать пользователя"
    -->
    <div *ngIf="!loading && user !== null">
        <div nz-space nzSize="small" style="margin-bottom: 10px;">
          <modal-button
            buttonText="Редактировать"
            modalTitle="Редактирование пользователя"
          >
            <user-form
              [user]="user"
              (userFormSubmit)="updateUser($event)"
            >
            </user-form>
          </modal-button>
          <button nz-button nzType="primary" nzDanger (click)="deleteUser(user.id)">Удалить</button>
        </div>
        <user-info [user]="user"></user-info>
    </div>
  
    <!-- Состояние загрузки пользователя -->
    <div nz-flex *ngIf="loading">
      <nz-space [nzSize]="[15, 0]">
        <nz-spin nzSimple nzSize="large" />
        <h2>Загрузка пользователя...</h2>
      </nz-space>
    </div>

    <!-- Обработка ошибки при загрузки пользователя -->
    <nz-alert 
      nzType="error" 
      nzMessage="Ошибка" 
      [nzDescription]="error" 
      nzShowIcon
      *ngIf="error"
    />
    <nz-demo-form-auto-tips />
  `,
  styles: ``
})
export class UserDetailPage implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);
  private readonly message = inject(NzMessageService);

  public user: null | IUser = null;

  public loading: boolean = false;
  public error: null | string = null;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.userService.getUserById(userId);
    
    setTimeout(() => {
      this.loading = false;
      if(this.user === null) this.error = 'Пользователь не найден';
      this.cdr.detectChanges();
    }, 1000);
  }

  updateUser(userData: Partial<IUser>): void { // Добавить запрос на сервер для галочки
    try {
      const userId = Number(this.route.snapshot.paramMap.get('id'));
      const user = this.userService.updateUser(userId, userData);
      this.user = user;
      this.message.create('success', 'Информация о пользователе обновлена');
    } catch (error) {
      this.message.create('error', `${error}`);
    }
  }

  deleteUser(id: number): void { // Добавить запрос на сервер для галочки
    try {
      this.userService.deleteUser(id);
      this.message.create('success', 'Пользователь удалён');
      setTimeout(() => {
        this.router.navigate(['/users']);
      }, 1000);
    } catch (error) {
      this.message.create('error', `${error}`)
    }
  }
}
