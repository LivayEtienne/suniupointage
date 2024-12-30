import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebareComponent } from './sidebare/sidebare.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebareComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sunupointage';
}

