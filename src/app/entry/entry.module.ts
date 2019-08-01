import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { EntryRoutingModule } from "./entry-routing.module";
import { EntryComponent } from "./_container/entry.component";
import { LoginComponent } from "./login/login.component";

const COMPONENTS = [EntryComponent, LoginComponent];
const MODULES = [CommonModule, SharedModule, EntryRoutingModule];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES]
})
export class EntryModule {}
