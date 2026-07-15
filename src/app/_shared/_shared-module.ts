import { NgModule } from "@angular/core";
import { AppList } from "./app-list";


const SharedComponents = [
  AppList,
]

@NgModule({
  imports: SharedComponents,
  exports: SharedComponents
})
export class SharedModule {}