import { Component, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
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

@Component({
  selector: 'app-stock-analysis',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './stock-analysis.component.html',
  styleUrl: './stock-analysis.component.css'
})
export class StockAnalysisComponent {
  selectedStock: string = '';
  selectedStockDet: any = '';
  errorMessage: string = '';
  selectedStockOverview: any = '';
  //country: string = ''
 // countries: string [] = ['India','USA','Canada'];
  //state: string[] = ['Maharashtra','NC','ON'];
  constructor(private http: HttpClient, private cacheService: CacheService) { }
  isPositive(value: string): boolean {
    const numericValue = parseFloat(value.replace('%', '').trim());
    return numericValue > 0;
  }
  fetchStockData() {
    if (!this.selectedStock) {
      this.errorMessage = 'Please enter a stock symbol.';
      console.log(this.errorMessage);
      return;
    }
    else if (!isNaN(Number(this.selectedStock)))
    {
      this.errorMessage = 'Please enter a stock symbol in string.';
      console.log(this.errorMessage);
      return;
    }
    else
    {
      this.errorMessage = '';
      const stockCacheKey = `stock-${this.selectedStock}`;
      const overviewCacheKey = `overview-${this.selectedStock}`;

      // Try to get cached data
      const cachedStock = this.cacheService.get(stockCacheKey);
      const cachedOverview = this.cacheService.get(overviewCacheKey);

      if (cachedStock) {
        this.selectedStockDet = cachedStock;
      }
      if (cachedOverview) {
        this.selectedStockOverview = cachedOverview;
      }
      if (cachedStock && cachedOverview) {
        console.log('Using cached data:', cachedStock, cachedOverview);
        return; // Use cached data, skip API calls
      }
      else {
        const apiKey = 'MEO8NKHWH1GUDQKL'; // Replace with your API key
        const fetchUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.selectedStock}&apikey=${apiKey}`;
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${this.selectedStock}&apikey=${apiKey}`;


        this.http.get(fetchUrl)
          .pipe(
            catchError(this.handleError)
          )
          .subscribe({
            next: (data: any) => {
              if (data['Global Quote'] && data['Global Quote']['05. price']) {
                console.log('Stock data:', data);
                this.selectedStockDet = {
                  symbol: data['Global Quote']['01. symbol'],
                  open: data['Global Quote']['02. open'],
                  high: data['Global Quote']['03. high'],
                  low: data['Global Quote']['04. low'],
                  price: data['Global Quote']['05. price'],
                  volume: data['Global Quote']['06. volume'],
                  latestTradingDay: data['Global Quote']['07. latest trading day'],
                  previousClose: data['Global Quote']['08. previous close'],
                  change: data['Global Quote']['09. change'],
                  changePercent: data['Global Quote']['10. change percent']
                };
                this.cacheService.set(stockCacheKey, this.selectedStockDet);
              } else {
                this.errorMessage = 'No data found for the given stock symbol.';
                console.log(this.errorMessage);
              }
            },
            error: (error) => {
              console.error('Error fetching stock data:', error);
              this.errorMessage = 'Failed to fetch stock data. Please try again.';
            }
          });
        // Fetch Overview data
        this.http.get(overviewUrl)
          .pipe(
            catchError(this.handleError)
          )
          .subscribe({
            next: (data: any) => {
              if (data && data['PERatio']) {
                console.log('Overview data:', data);
                // Merge Overview data into selectedStockDet
                this.selectedStockOverview = {
                  marketCap: data['MarketCapitalization'],
                  name: data['Name'],
                  peRatio: data['PERatio'],
                  dividendYield: data['DividendYield']
                };
                this.cacheService.set(overviewCacheKey, this.selectedStockOverview);
              } else {
                this.errorMessage = 'No data found for the given stock symbol in Overview.';
                console.log(this.errorMessage);
              }
            },
            error: (error) => {
              console.error('Error fetching Overview data:', error);
              this.errorMessage = 'Failed to fetch Overview data. Please try again.';
            }
          });
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server-side error: ${error.status} - ${error.message}`);
    }
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
