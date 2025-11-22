import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { DataservicesService, Customer } from '../services/dataservices.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'web';
  loadData = 20;
  customers: Customer[] = [];
  displayedColumns: string[] = [];
  isLoading = false;
  hasMore = true;
  errorMessage = '';

  constructor(private dataservicesService: DataservicesService) {}

  ngOnInit(): void {
    this.loadCustomerData();
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 80;

    if (nearBottom && this.hasMore && !this.isLoading) {
      this.fetchCustomers(this.customers.length);
    }
  }

  private loadCustomerData(): void {
    this.dataservicesService.loadCustomerData().subscribe({
      next: () => {
        this.fetchCustomers(0);
      },
    });
  }

  private fetchCustomers(start: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dataservicesService.getCustomerData(start, this.loadData).subscribe({
      next: (response) => {
        this.customers = [...this.customers, ...response.data];
        if(this.displayedColumns.length === 0){
          this.syncColumns(response.data);
        }
        this.hasMore = response.hasMore;
      },
      error: (error) => {
        console.error('Failed to load customers', error);
        this.errorMessage = 'Unable to load customers. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private syncColumns(newRows: Customer[]): void {
    newRows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!this.displayedColumns.includes(key)) {
          this.displayedColumns.push(key);
        }
      });
    });
  }

}