import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = '/db';

  constructor(private http: HttpClient) {}

  addInitialData(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }

  deleteData(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}