import { Component, Input } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'modal-button',
  imports: [
    NzButtonModule,
    NzModalModule
  ],
  template: `
    <!--
      Кнопка для открытия модального окна
    -->
    <button 
      nz-button 
      nzType="primary"
      (click)="openModal()"
    >
      {{buttonText}}
    </button>

    <!--
      Модальное окно, 
      в тело которого передаётся форма.
    -->
    <nz-modal 
      [(nzVisible)]="isVisible" 
      [nzTitle]="modalTitle"
      (nzOnCancel)="closeModal()"
      [nzFooter]="null"
    >
      <ng-container *nzModalContent>
        <ng-content></ng-content>
      </ng-container>
    </nz-modal>
  `,
  styles: ``
})
export class ModalButtonComponent {
  @Input() buttonText: string = 'Кнопка';
  @Input() modalTitle: string = 'Заголовок модального окна';

  public isVisible: boolean = false;

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
  }
}
