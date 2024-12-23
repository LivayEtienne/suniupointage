import { Routes } from '@angular/router';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';
export const routes: Routes = [
    { path: 'dasboard', component: DasbordComponent },
    { path: 'pointage', component: PointageComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: '', redirectTo: '/dasboard', pathMatch: 'full' }
];
