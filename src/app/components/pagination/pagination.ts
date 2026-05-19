import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/models';

@Component({
  selector: 'pagination',
  imports: [CommonModule],
  template: `
    <!-- Пагинация -->
    <div class="pagination-section">
      <div class="pagination-controls">
        <button 
          (click)="previousPage()" 
          [disabled]="currentPage === 1"
          class="pagination-btn">
          ← Назад
        </button>
        
        <span class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
        
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
  @Input() pageSize: number = 4;
  @Input() currentPage: number = 1;
  
  @Output() returnPaginatedUsers = new EventEmitter<IUser[]>();
  
  totalPages = 0;
  paginatedUsers: IUser[] = [];

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Pagination: ', changes)
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

  private paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
    this.returnPaginatedUsers.emit(this.paginatedUsers);
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
}
