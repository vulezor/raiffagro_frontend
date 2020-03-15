import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EntryComponent } from "./_container/entry.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "@mdz/guards";

const routes: Routes = [
  {
    path: "",
    component: EntryComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule {}
