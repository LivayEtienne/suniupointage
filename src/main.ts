import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { HistoriqueComponent } from './app/historique/historique.component';
import { PointageComponent } from './app/pointage/pointage.component';
import { DasbordComponent } from './app/dasbord/dasbord.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
