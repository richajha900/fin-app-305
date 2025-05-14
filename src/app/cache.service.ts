import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  get(key: string): any | null {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.clear();
  }
}
