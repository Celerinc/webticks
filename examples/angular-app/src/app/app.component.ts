import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebticksTrackerComponent } from '@webticks/angular-ts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WebticksTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
}
