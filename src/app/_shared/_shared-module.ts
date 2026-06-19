import { NgModule } from "@angular/core";
import { AppList } from "./app-list";
import { AppInputText } from "./app-input-text";
import { AppInputPassword } from "./app-input-password";
import { AppInputSelect } from "./app-input-select";


const SharedComponents = [
  AppList,
  AppInputText,
  AppInputPassword,
  AppInputSelect
]

@NgModule({
  imports: SharedComponents,
  exports: SharedComponents
})
export class SharedModule {}