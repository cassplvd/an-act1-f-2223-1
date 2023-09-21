import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { abreFecha } from './animations';
import { AppComponent } from './app.component';
import { EmptyComponent } from './empty/empty.component';
import { HomeComponent } from './home/home.component';
import { PanelBottomComponent } from './panel-bottom/panel-bottom.component';
import { HabilidadesTabComponent } from './window/habilidades-tab/habilidades-tab.component';
import { HistoriaTabComponent } from './window/historia-tab/historia-tab.component';
import { IdentidadeTabComponent } from './window/identidade-tab/identidade-tab.component';
import { InventarioComponent } from './window/inventario-tab/inventario.component';
import { ObservacoesTabComponent } from './window/observacoes-tab/observacoes-tab.component';
import { PericiasTabComponent } from './window/pericias-tab/pericias-tab.component';
import { TalentosTabComponent } from './window/talentos-tab/talentos-tab.component';
import { WindowComponent } from './window/window.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      // {
      //   path: 'home', component: PanelBottomComponent,
      //   data: { animation: 'HomePage' },
      // },
      {
        path: 'w', component: WindowComponent,
        data: { animation: 'WindowPage' },
        children: [
          {
            path: 'hist', component: HistoriaTabComponent,
            data: { animation: 'HistoriaPage' }
          },
          {
            path: 'atri', component: HabilidadesTabComponent,
            data: { animation: 'HabilidadePage' }
          },
          {
            path: 'ide', component: IdentidadeTabComponent,
            data: { animation: 'IdentidadePage' }
          },
          {
            path: 'peri', component: PericiasTabComponent,
            data: { animation: 'IdentidadePage' }
          },
          {
            path: 'tale', component: TalentosTabComponent,
            data: { animation: 'IdentidadePage' }
          },
          {
            path: 'inv', component: InventarioComponent,
            data: { animation: 'InventarioPage' }
          },
          {
            path: 'obs', component: ObservacoesTabComponent,
            data: { animation: 'ObservacaoPage' }
          },
        ]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
