import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { FrmField, IUser } from '../../models/models';

@Component({
  selector: 'user-form',
  imports: [
    ReactiveFormsModule,
    NzFlexModule,
    NzSpaceModule,
    NzButtonModule,
    NzFormModule,
    NzCollapseModule
  ],
  template: `
    <form nz-form [formGroup]="userForm">
      <nz-collapse>

        <!-- 
          Отображаем секции формы: 
          1) Контактные данные
          2) Информация о компании
          3) Адрес
        -->
        @for (panel of panels; track panel) {
            <nz-collapse-panel 
              [formGroupName]="panel.groupName" 
              [nzHeader]="panel.name" 
              [nzActive]="panel.active"
            >

              <!-- 
                В каждой секции отображаем 
                соотвествующие ей поля формы
              -->
              @for (field of panel.fields; track field.id) {
                <nz-form-item>
                  <nz-form-label 
                    [nzSpan]="7" 
                    [nzFor]="field.name" 
                    [nzRequired]="field.required"
                  >
                    {{field.label}}
                  </nz-form-label>
                  <nz-form-control 
                    [nzSpan]="12"
                    [nzErrorTip]="field.errorTip || ''"
                  >
                    <input
                      [id]="field.name"
                      nz-input
                      [formControlName]="field.controlName"
                      placeholder="{{field.placeholder}}" 
                    />
                  </nz-form-control>
                </nz-form-item>
              }
                
            </nz-collapse-panel>
        }

      </nz-collapse>
      
      <!-- 
        Кнопки:
        1) Для сброса полей формы
        2) Для отправки данных из формы
      -->
      <div nz-flex nzJustify='flex-end'>
        <div nz-space nzSize='small'>
          <button nz-button nzType="primary" (click)="resetForm()" type="button">Сбросить форму</button>
          <button nz-button nzType="primary" (click)="submitForm()">{{user ? 'Сохранить' : 'Создать'}}</button>
        </div>
      </div>
    </form>
  `,
  styles: `
    nz-collapse {
      margin-bottom: 20px;
    }
    nz-form-item {
      margin: 0 auto;
      min-width: 500px;
    }
    nz-form-item input {
      width: 100%;
    }
  `
})
export class UserFormComponent implements OnChanges {
  @Input() user: IUser | undefined;

  @Output() userFormSubmit = new EventEmitter<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>>();

  private readonly fb = inject(NonNullableFormBuilder);

  public userForm = this.fb.group({
    contacts: this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
    }),
    company: this.fb.group({
      name: [''],
      catchPhrase: [''],
      bs: ['']
    }),
    address: this.fb.group({
      street: [''],
      suite: [''],
      city: [''],
      zipcode: [''],
      geo: this.fb.group({
        lat: [''],
        lng: ['']
      })
    }),
  });

  public contactFields: FrmField[] = [
    {
      id: 1,
      label: "Полное имя",
      name: "name",
      controlName: "name",
      inputType: "text",
      placeholder: "Введите полное имя",
      required: true,
      errorTip: "Введите своё полное имя!"
    },
    {
      id: 2,
      label: "Имя пользователя",
      name: "username",
      controlName: "username",
      inputType: "text",
      placeholder: "Введите имя пользователя",
      required: true,
      errorTip: "Введите своё имя пользователя!"
    },
    {
      id: 3,
      label: "Почта",
      name: "email",
      controlName: "email",
      inputType: "email",
      placeholder: "Введите почту",
      required: true,
      errorTip: "Введите свою почту!"
    },
    {
      id: 4,
      label: "Телефон",
      name: "phone",
      controlName: "phone",
      inputType: "tel",
      placeholder: "Введите номер телефона",
      required: false,
      errorTip: ""
    },
    {
      id: 5,
      label: "Сайт",
      name: "website",
      controlName: "website",
      inputType: "text",
      placeholder: "Введите название сайта",
      required: false,
      errorTip: ""
    }
  ];

  public companyFields: FrmField[] = [
    {
      id: 1,
      label: "Название",
      name: "company",
      controlName: "name",
      inputType: "text",
      placeholder: "Введите название компании",
      required: false
    },
    {
      id: 2,
      label: "Слоган",
      name: "catchPhrase",
      controlName: "catchPhrase",
      inputType: "text",
      placeholder: "Введите слоган компании",
      required: false
    },
    {
      id: 3,
      label: "Сфера деятельности",
      name: "bs",
      controlName: "bs",
      inputType: "text",
      placeholder: "Введите сферу деятельности компании",
      required: false
    }
  ];

  public addressFields: FrmField[] = [
    {
      id: 1,
      label: "Улица",
      name: "street",
      controlName: "street",
      inputType: "text",
      placeholder: "Введите улицу",
      required: false
    },
    {
      id: 2,
      label: "Здание",
      name: "suite",
      controlName: "suite",
      inputType: "text",
      placeholder: "Корпус/Строение/Офис",
      required: false
    },
    {
      id: 3,
      label: "Город",
      name: "city",
      controlName: "city",
      inputType: "text",
      placeholder: "Введите название города",
      required: false
    },
    {
      id: 4,
      label: "Почтовый индекс",
      name: "zipcode",
      controlName: "zipcode",
      inputType: "text",
      placeholder: "Введите свой почтовый индекс",
      required: false
    }
  ];

  public panels = [
    {
      groupName: "contacts",
      active: true,
      name: 'Контактные данные',
      fields: this.contactFields
    },
    {
      groupName: "company",
      active: false,
      name: 'Информация о компании',
      fields: this.companyFields
    },
    {
      groupName: "address",
      active: false,
      name: 'Адрес',
      fields: this.addressFields
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['user'] && this.user && this.userForm) {
      const userContacts = {
        contacts: {
          name: this.user.name,
          username: this.user.username,
          email: this.user.email,
          phone: this.user.phone || '',
          website: this.user.website || ''
        }
      }
      this.userForm.patchValue(userContacts);
      this.userForm.patchValue(this.user);
    }
  }

  submitForm() {
    if(this.userForm.valid) {
      const formValue = this.userForm.value;

      const userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formValue.contacts && formValue.contacts.name || '',
        username: formValue.contacts && formValue.contacts.username || '',
        email: formValue.contacts && formValue.contacts.email || '',
        phone: formValue.contacts && formValue.contacts.phone || '',
        website: formValue.contacts && formValue.contacts.website || '',
        company: formValue.company ? {
          name: formValue.company.name || '',
          catchPhrase: formValue.company.catchPhrase || '',
          bs: formValue.company.bs || ''
        } : undefined,
        address: formValue.address ? {
          street: formValue.address.street || '',
          suite: formValue.address.suite || '',
          city: formValue.address.city || '',
          zipcode: formValue.address.zipcode || '',
          geo: formValue.address.geo ? {
            lat: formValue.address.geo.lat || '',
            lng: formValue.address.geo.lng || ''
          } : undefined
        } : undefined
      };

      this.userFormSubmit.emit(userData);
      this.userForm.reset();
    } else {
      console.log(this.userForm.controls)
      Object.values(this.userForm.controls.contacts.controls).forEach(control => {
        if(control.invalid) {
          console.log('dirty')
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        } 
      });
    }
  }

  resetForm() {
    this.userForm.reset();
  }
}
