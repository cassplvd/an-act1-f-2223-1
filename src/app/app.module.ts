import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { PanelLeftComponent } from './panel-left/panel-left.component';
import { PanelRightComponent } from './panel-right/panel-right.component';
import { PanelBottomComponent } from './panel-bottom/panel-bottom.component';
import { MapaComponent } from './mapa/mapa.component';
import { WindowComponent } from './window/window.component';
import { PericiasTabComponent } from './window/pericias-tab/pericias-tab.component';
import { HistoriaTabComponent } from './window/historia-tab/historia-tab.component';
import { IdentidadeTabComponent } from './window/identidade-tab/identidade-tab.component';
import { ObservacoesTabComponent } from './window/observacoes-tab/observacoes-tab.component';
import { HomeComponent } from './home/home.component';
import { EmptyComponent } from './empty/empty.component';
import { InventarioComponent } from './window/inventario-tab/inventario.component';
import { HabilidadesTabComponent } from './window/habilidades-tab/habilidades-tab.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { DialogAnimationsExampleDialog } from './window/change-dialog/change-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { TalentosTabComponent } from './window/talentos-tab/talentos-tab.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ExcluirDialogComponent } from './excluir-dialog/excluir-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    TopPanelComponent,
    PanelLeftComponent,
    PanelRightComponent,
    PanelBottomComponent,
    MapaComponent,
    WindowComponent,
    PericiasTabComponent,
    HistoriaTabComponent,
    IdentidadeTabComponent,
    ObservacoesTabComponent,
    HomeComponent,
    EmptyComponent,
    InventarioComponent,
    HabilidadesTabComponent,
    DialogAnimationsExampleDialog,
    TalentosTabComponent,
    ExcluirDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
