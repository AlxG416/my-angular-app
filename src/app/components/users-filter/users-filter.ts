import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../models/models';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'users-filter',
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Поле фильтрации -->
    <div class="filter-section">
      <input
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange()"
        type="text"
        placeholder="Поиск по имени или email..."
        class="search-input"
      />
      <button *ngIf="searchTerm" class="clear-btn" (click)="clearSearch()">
        ✕
      </button>
    </div>
  `,
  styles: `
    .filter-section {
      position: relative;
      top: 8px;
      margin-bottom: 20px;
      max-width: 400px;
      min-width: 350px;
    }

    .search-input {
      width: 100%;
      padding: 10px 35px 10px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #999;
      padding: 0;
    }

    .clear-btn:hover {
      color: #333;
    }
  `
})
export class UsersFilterComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Input() users: IUser[] = [];

  @Output() returnFilteredUsers = new EventEmitter<IUser[]>();

  filteredUsers: IUser[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.setupSearchDebounce();
  }

  ngOnChange(changes: SimpleChanges): void {
    console.log('Filter: ', changes)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilter();
      this.returnFilteredUsers.emit(this.filteredUsers);
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  private applyFilter(): void {
    if(!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLocaleLowerCase().includes(searchLower)
      );
    }
  }
}
