import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebticksAnalytics } from '@webticks/angular-ts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WebticksAnalytics],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
}
