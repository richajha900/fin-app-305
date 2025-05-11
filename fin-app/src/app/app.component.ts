import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import {StockAnalysisComponent} from './stock-analysis/stock-analysis.component';


@Component({
  selector: 'app-root',
  imports: [FormsModule,HeaderComponent,StockAnalysisComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fin-app';
  textValue: string = '';

}
