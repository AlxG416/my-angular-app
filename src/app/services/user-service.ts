import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';

import { DeepPartialIUser, IUser } from '../models/models';
import { deepMerge } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private readonly storageKey = 'users';

  wasGetAllUsersAPIExecuted: boolean = false; // Плохое решение для котроля первой подгрузки пользователей, упираемся в ограничения работы placeholder api. 

  private readonly defaultTimeout = 10000;
  private readonly maxRetries = 2;

  getAllUsersAPI(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl).pipe(
      timeout(this.defaultTimeout),
      retry(this.maxRetries),
      map(users => this.transformUsers(users)),
      catchError(this.handleError<IUser[]>('getAllUsersAPI', []))
    );
  }

  private transformUser(user: any): IUser {
    return {
      ...user,
      createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
    } as IUser;
  }

  private transformUsers(users: any[]): IUser[] {
    return users.map(user => this.transformUser(user));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      let errorMessage = 'Произошла ошибка';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Ошибка на клиенте: ${error.error.message}`;
      } else {
        errorMessage = `Ошибка со стороны сервера: ${error.status} - ${error.message}`;
      }
      
      console.error(errorMessage);
      
      return throwError(() => new Error(errorMessage));
    };
  }

  getAllUsers(): IUser[] {
    const usersStorage = localStorage.getItem(this.storageKey);
    if(!usersStorage) return [];
    return JSON.parse(usersStorage);
  }

  getUserById(id: number): IUser | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  createUser(userData: IUser): IUser { // Доработать
    const users = this.getAllUsers();

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = {
      ...userData,
      id: newId
    };

    users.push(newUser);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return newUser;
  }

  updateUser(id: number, updatedData: DeepPartialIUser) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
        throw new Error(`Пользователь с ID ${id} не найден`);
    }
    
    const updatedUser = {
        ...deepMerge(users[userIndex], updatedData),
        id
    };
    
    users[userIndex] = updatedUser;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error(`Пользователь с ID ${id} не найден`);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
    return true;
  }
}
