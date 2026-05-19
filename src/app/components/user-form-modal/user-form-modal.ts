import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { IUser } from '../../models/models';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'user-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFlexModule,
    NzButtonModule, 
    NzModalModule, 
    NzFormModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <nz-modal 
      [(nzVisible)]="isVisible" 
      [nzTitle]="user ? 'Редактирование пользователя' : 'Создание пользователя'"
      [nzContent]="modalContent"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()" 
      (nzOnOk)="handleSubmit()"
    >
      <ng-template #modalContent>
        <form nz-form [formGroup]="userForm">
          @for (field of fields; track field.id) {
            <nz-form-item>
              <nz-form-label [nzSpan]="7" [nzFor]="field.name" [nzRequired]="field.required">
                {{field.label}}
              </nz-form-label>
              <nz-form-control [nzSpan]="12" nzValidatingTip="Validating...">
                <input
                  [id]="field.name"
                  nz-input
                  [formControlName]="field.name"
                  placeholder="{{field.placeholder}}" 
                />
              </nz-form-control>
            </nz-form-item>
          }
        </form>
      </ng-template>

      <ng-template #modalFooter>
        <button nz-button (click)="handleCancel()">Отмена</button>
        <button nz-button (click)="handleSubmit()">{{user ? 'Сохранить' : 'Создать'}}</button>
      </ng-template>
    </nz-modal>
  `,
  styles: ``
})

export class UserFormModalComponent implements OnChanges {
  @Input() isVisible: boolean = false; // вернуть false
  @Input() isEditing: boolean = false;
  @Input() user: IUser | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<Partial<IUser>>();

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user && this.userForm) {
      this.userForm.patchValue(this.user);
    }
  }

  userForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    username: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    website: new FormControl('', { nonNullable: true }),
  });


  fields = [
    {
      id: 1,
      label: "Полное имя",
      name: "name",
      inputType: "text",
      placeholder: "Введите полное имя",
      required: true
    },
    {
      id: 2,
      label: "Имя пользователя",
      name: "username",
      inputType: "text",
      placeholder: "Введите имя пользователя",
      required: true
    },
    {
      id: 3,
      label: "Почта",
      name: "email",
      inputType: "email",
      placeholder: "Введите почту",
      required: true
    },
    {
      id: 4,
      label: "Телефон",
      name: "phone",
      inputType: "text",
      placeholder: "Введите номер телефона",
      required: false
    },
    {
      id: 5,
      label: "Сайт",
      name: "website",
      inputType: "text",
      placeholder: "Введите название сайта",
      required: false
    }
  ];
  
  handleSubmit(): void {
    console.log(this.userForm.value)
    this.submitModal.emit(this.userForm.value);
    this.userForm.reset();
  }

  handleCancel(): void {
    this.closeModal.emit();
  }
}
