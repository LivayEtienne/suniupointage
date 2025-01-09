import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReussiComponent } from '../reussi/reussi.component';

@Component({
  selector: 'app-sidebare',
  imports: [RouterModule, ReussiComponent],
  templateUrl: './sidebare.component.html',
  styleUrls: ['./sidebare.component.css']
})
export class SidebareComponent {

}
