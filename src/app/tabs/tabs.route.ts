import { Route } from "@angular/router";
import { HomePage } from "./home/home.page";
import { RecurrenciesPage } from "./recurrencies/recurrencies.page";
import { TabsPage } from "./tabs.page";



// const homeRoute: Route[] = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', component: HomePage },
//   { path: '**', redirectTo: 'home', pathMatch: 'full' }
// ]

// const recurrenciesRoute: Route[] = [
//   { path: 'recurrencies', component: RecurrenciesPage },
// ]

// export const tabsRoute: Route[] = [
//   { path: '', component: TabsPage, loadChildren: () => childrenRoute}
// ]


export const tabsRoute: Route[] = [
  { path: '', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'recurrencies', component: RecurrenciesPage },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]}
]