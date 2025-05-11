import { Component, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-analysis',
  imports: [FormsModule, CommonModule],
  templateUrl: './stock-analysis.component.html',
  styleUrl: './stock-analysis.component.css'
})
export class StockAnalysisComponent {
  selectedStock: string = '';
  selectedStockDet: string = '';
  abc: number = 1;
  errorMessage: string = '';
  country: string = ''
  countries: string [] = ['India','USA','Canada'];
  state: string[] = ['Maharashtra','NC','ON'];
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
      console.log(this.selectedStock);
      this.selectedStockDet = this.selectedStock;
      return this.selectedStockDet;


    }
  }
}
