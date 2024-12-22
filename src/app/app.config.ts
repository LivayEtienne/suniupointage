import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';  // Importez `withFetch`
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Correct module for forms
import { routes } from './app.routes';  // Importez les routes depuis app.routes.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Fournisseur de routes avec les routes importées
    provideHttpClient(withFetch()),  // Activez `fetch` pour HttpClient
    provideClientHydration(withEventReplay()),
    FormsModule,  // Ajout de FormsModule pour les formulaires template-driven
  ]
};
