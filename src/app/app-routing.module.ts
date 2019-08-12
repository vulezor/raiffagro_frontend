import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./application/application.module").then(m => m.ApplicationModule)
  // },
  {
    path: 'public',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
