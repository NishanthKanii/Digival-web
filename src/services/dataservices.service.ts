import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Customer = Record<string, any>;

export interface CustomerResponse {
  data: Customer[];
  start: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataservicesService {
  private readonly baseUrl = 'https://digival-api.onrender.com';

  constructor(private http: HttpClient) {}

  getCustomerData(start: number, limit: number): Observable<CustomerResponse> {
    const params = new HttpParams()
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<CustomerResponse>(`${this.baseUrl}/api/customers`, { params });
  }

  loadCustomerData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/customers/load`);
  }
}
