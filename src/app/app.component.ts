import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataservicesService, Customer } from '../services/dataservices.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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
  showScrollTop = false;

  constructor(private dataservicesService: DataservicesService) {}

  ngOnInit(): void {
    this.loadCustomerData();
  }

  onScroll(event: Event): void {
    // Use currentTarget instead of target - currentTarget is the element with the event listener
    const scrollElement = (event.currentTarget || event.target) as HTMLElement;
    
    if (!scrollElement) {
      console.error('Scroll event: No element found');
      return;
    }
    
    const scrollTop = scrollElement.scrollTop;
    const clientHeight = scrollElement.clientHeight;
    const scrollHeight = scrollElement.scrollHeight;
    
    console.log('Scroll event triggered:', {
      scrollTop,
      clientHeight,
      scrollHeight,
      scrollBottom: scrollTop + clientHeight,
      distanceFromBottom: scrollHeight - (scrollTop + clientHeight),
      hasMore: this.hasMore,
      isLoading: this.isLoading
    });
    
    // Show/hide scroll to top button based on scroll position
    this.showScrollTop = scrollTop > 40;
    
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 80;
    
    console.log('Near bottom check:', {
      nearBottom,
      condition: `${scrollTop} + ${clientHeight} >= ${scrollHeight} - 80`,
      result: nearBottom
    });

    if (nearBottom && this.hasMore && !this.isLoading) {
      console.log('Triggering API call - fetching more customers from index:', this.customers.length);
      this.fetchCustomers(this.customers.length);
    } else {
      console.log('API call NOT triggered. Reasons:', {
        nearBottom,
        hasMore: this.hasMore,
        isLoading: this.isLoading
      });
    }
  }

  scrollToTop(): void {
    const tableContent = document.querySelector('.table-content') as HTMLElement;
    if (tableContent) {
      tableContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private loadCustomerData(): void {
    console.log("loadCustomerData");
    this.dataservicesService.loadCustomerData().subscribe({
      next: () => {
        this.fetchCustomers(0);
      },
    });
  }

  private fetchCustomers(start: number): void {
    console.log('fetchCustomers called with start:', start);
    this.isLoading = true;
    this.errorMessage = '';

    this.dataservicesService.getCustomerData(start, this.loadData).subscribe({
      next: (response) => {
        console.log('API response received:', {
          dataCount: response.data?.length || 0,
          hasMore: response.hasMore,
          totalCustomers: this.customers.length + (response.data?.length || 0)
        });
        this.customers = [...this.customers, ...response.data];
        if(this.displayedColumns.length === 0){
          this.syncColumns(response.data);
        }
        this.hasMore = response.hasMore;
        console.log('Updated state:', {
          totalCustomers: this.customers.length,
          hasMore: this.hasMore
        });
      },
      error: (error) => {
        console.error('Failed to load customers', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          error: error
        });
        this.errorMessage = 'Unable to load customers. Please try again.';
      },
      complete: () => {
        console.log('API call completed');
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