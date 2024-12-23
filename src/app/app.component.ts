import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebareComponent } from './sidebare/sidebare.component';
import { DasbordComponent } from './dasbord/dasbord.component';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebareComponent,DasbordComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sunioupointage';
}
