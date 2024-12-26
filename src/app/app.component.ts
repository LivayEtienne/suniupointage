import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//import { VigileComponent } from './vigile/vigile.component';
import { ApprenantComponent } from "./apprenant/apprenant.component";
import { SidebarComponent } from './sidebar/sidebar.component';
//import { ConnexionComponent } from './connexion/connexion.component';
//mport { DepartementComponent } from './departement/departement.component';
//import { DashboardComponent } from './dashboard/dashboard.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sunioupointage';
}
