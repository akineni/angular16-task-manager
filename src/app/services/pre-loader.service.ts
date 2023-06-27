import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreLoaderService {

  private loading: boolean;
  private contd: boolean = false;
  private message: string;

  constructor() { }

  enable(message: string = ''): void {
    this.loading = true;
    this.message = message;
  }

  disable(): void {
    this.loading = this.contd;
    this.contd = false;
  }

  continue(): void {
    this.contd = true;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getMessage(): string {
    return this.message;
  }
}
