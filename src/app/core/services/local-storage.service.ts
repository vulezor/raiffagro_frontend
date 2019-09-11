import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  public setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): string {
    return localStorage.getItem(key);
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public setItemTry(
    key: string,
    value: string,
    deleteAfterCatch: boolean = false
  ): boolean {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (deleteAfterCatch) {
        this.removeItem(key);
      }
      return;
    }
    return true;
  }
}
