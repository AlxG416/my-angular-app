import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UserFormModalComponent } from '../../components/user-form-modal/user-form-modal';
import { UserInfoComponent } from '../../components/user-info/user-info-component';

import { UserService } from '../../services/user-service';
import { IUser } from '../../models/models';

@Component({
  selector: 'user-detail-page',
  imports: [
    CommonModule, 
    RouterLink, 
    NzFlexModule,
    NzSpaceModule,
    NzButtonModule, 
    NzSpinModule,
    UserFormModalComponent,
    UserInfoComponent
  ],
  template: `
    <button nz-button nzType="link" routerLink="/users">← Вернуться назад</button>
    @if(!loading) {
      @if(user !== null) {
        <button nz-button nzType="default" (click)="showModal()">Редактировать</button>
        <button nz-button nzDanger (click)="deleteUser(user.id)">Удалить</button>
        <user-info [user]="user"></user-info>
      } @else {
        <h1>Пользователь не найден</h1>  
      }
    } @else {
      <div nz-flex class="loading-state" *ngIf="!error">
        <nz-space [nzSize]="[15, 0]">
          <nz-spin nzSimple nzSize="large" />
          <h2>Загрузка пользователя...</h2>
        </nz-space>
      </div>
    }
    <user-form-modal
      [isVisible]="isModalVisible"
      [isEditing]="true"
      [user]="user"
      (closeModal)="closeModal()"
      (submitModal)="updateUser($event)"
    ></user-form-modal>
  `,
  styles: ``
})
export class UsersDetailPage implements OnInit {
  user: null | IUser = null;
  loading: boolean = false;
  error: null | string = null;
  isModalVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.userService.getUserById(userId);
    
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  updateUser(userData: Partial<IUser>): void {
    try {
      const userId = Number(this.route.snapshot.paramMap.get('id'));
      const user = this.userService.updateUser(userId, userData);
      this.user = user;
      this.createMessage('success', 'Информация о пользователе обновлена');
    } catch (error) {
      this.createMessage('error', `${error}`)
    }
    this.isModalVisible = false;
  }

  deleteUser(id: number): void {
    try {
      this.userService.deleteUser(id);
      this.createMessage('success', 'Пользователь удалён')
      setTimeout(() => {
        this.router.navigate(['/users']);
      }, 1000);
    } catch (error) {
      this.createMessage('error', `${error}`)
    }
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
