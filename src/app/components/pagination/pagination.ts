import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IUser } from '../../models/models';

@Component({
  selector: 'pagination',
  imports: [CommonModule],
  template: `
    <!-- 
      Интерфейс для управления пагинацией:
      1) Кнопка для перехода на предыдущую страницу
      2) Информация о текущей странице и их общем количестве
      3) Кнопка для перехода на следующую страницу
    -->
    <div class="pagination-section" *ngIf="totalPages > 0">
      <div class="pagination-controls">

        <!--
          1) Кнопка для перехода на предыдущую страницу
        -->
        <button 
          (click)="previousPage()" 
          [disabled]="currentPage === 1"
          class="pagination-btn">
          ← Назад
        </button>
        
        <!--
          2) Информация о текущей странице и их общем количестве
        -->
        <span class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
        
        <!--
          3) Кнопка для перехода на следующую страницу
        -->
        <button 
          (click)="nextPage()" 
          [disabled]="currentPage === totalPages"
          class="pagination-btn">
          Вперед →
        </button>
      </div>
    </div>
  `,
  styles: `
    .pagination-section {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .pagination-btn {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .pagination-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `
})
export class PaginationComponent implements OnChanges {
  @Input() users: IUser[] = [];
  
  @Output() usersPaginated = new EventEmitter<IUser[]>();

  public pageSize: number = 5; // В будущем переделать на Input()
  public currentPage: number = 1; // Не буду управлять currentPage из компонента родителя
  public totalPages = 0;

  private paginatedUsers: IUser[] = [];

  /* 
    Как только обновляется переданный параметр users 
    в компонент, функция производит
    перерасчёт currentPage и в конце вызывает
    this.paginateUsers()
  */
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['users']) {
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage = 1;
      }
      this.paginateUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateUsers();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }

  /* 
    Работает с переданными 
    в компонент пользователями и возвращает
    необходимых пользователей из компонента
    для отрисовки на текущей странице
  */
  private paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
    this.usersPaginated.emit(this.paginatedUsers);
  }
}
