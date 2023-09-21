import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PanelCtrlService } from './panel-ctrl-service.service';

@Injectable({
  providedIn: 'root'
})
export class WindowCtrlService {

  tabs: any = {
    'historia': { "url": "hist", "nome": "História" },
    'identidade': { "url": "ide", "nome": "Identidade" },
    'atributos': { "url": "atri", "nome": "Atributos" },
    'pericias': { "url": "peri", "nome": "Perícias" },
    'talentos': { "url": "tale", "nome": "Talentos" },
    'inventario': { "url": "inv", "nome": "Inventário" },
    // 'pessoas': { "url": "o", "nome": "Pessoas" },
    // 'observacoes': { "url": "o", "nome": "Observações" }
  };

  urlSelecionada: string = '';
  tabSelecionada: string = '';

  constructor(http: HttpClient,
    private panelService: PanelCtrlService) { }


  setTabSelecionada(url: any, tab: any) {

    this.urlSelecionada = url;
    this.tabSelecionada = tab;
    this.panelService.sendCategoria(tab);
    this.panelService.sendDado('invalido');

  }

  getTabUrl(tabId: any) {
    return this.tabs[tabId].url;
  }

  getTab(tabAtual: string = "atri") {
    if (this.tabSelecionada === "") {
      this.convertUrlToTabName(tabAtual);
    }
    return this.tabSelecionada;
  }

  convertUrlToTabName(tabAtual: any) {
    Object.keys(this.tabs).forEach(elemento => {
      if (this.tabs[elemento].url === tabAtual) {
        this.tabSelecionada = elemento;
      }
    });
  }

  getTabsAll() {
    return this.tabs;
  }



}
