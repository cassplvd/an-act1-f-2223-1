import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PersonagemService } from '../personagem.service';
import { WindowCtrlService } from '../window-ctrl.service';
import habilidades from '../../data/habilidades.json'
import tabsImagens from '../../data/tabs-imagens.json'
import { PanelCtrlService } from '../panel-ctrl-service.service';

@Component({
  selector: 'app-panel-bottom',
  templateUrl: './panel-bottom.component.html',
  styleUrls: ['./panel-bottom.component.scss'],
  // host: {
  //   'style': 'width: 100%; display: block; height: 100%;'
  // }
})
export class PanelBottomComponent implements OnInit, OnDestroy {

  url: string = '';
  openWP: boolean = false;
  @Output() windowOn = new EventEmitter<boolean>();
  personagemSub: Subscription = new Subscription;
  infoComplementaresSubscription: Subscription = new Subscription;
  tabs: any;
  tabsId: any;
  tabsNames: any = {};
  tabsTitulos: any = [];
  tabsUrl: any;
  habilidades: any;
  topHabilidades: any;
  tHarray = new Array<any>;
  personagem: any;
  habilidadesNames: any = habilidades;
  infosObject: any = {};
  imagensObject: any = {};
  tabsObject: any = tabsImagens;

  constructor(private windowService: WindowCtrlService,
    private personagemService: PersonagemService,
    private panelService: PanelCtrlService,
    private router: Router) {
    this.url = windowService.getTab();
    this.tabs = windowService.getTabsAll();


    this.tabsId = Object.keys(this.tabs);
    Object.keys(this.tabs).forEach((element: any) => {
      this.tabsNames[element] = {};
      this.tabsNames[element] = this.tabs[element].nome;
    });

  }

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.personagemSub.unsubscribe();
  }

  iniciar() {
    this.infoComplementaresSubscription = this.panelService.getInfos('atributos')
      .subscribe((atributosData: any) => {
        this.infosObject = atributosData;
        this.infosObject.forEach((atributos: any) => {
          if (atributos.img !== "") {
            this.imagensObject[atributos.nome] = {};
            this.imagensObject[atributos.nome].img = atributos.img;
          }

        });

        this.personagemSub = this.personagemService.getPersonagem()
          .subscribe((data: any) => {
            this.personagemService.setPersonagem(data)
            this.habilidades = data.informacoesPersonagem;
            this.topHabilidades = Object.fromEntries(
              Object.entries(this.habilidades).sort(([, a]: any, [, b]: any) => b - a)
            );

            var atributosPraIgnorar = ["totalPontos", "vida", "energia", "sanidade"]
            atributosPraIgnorar.forEach(atributo => {
              if (this.topHabilidades[atributo]) {
                delete this.topHabilidades[atributo];
              }
            })

            var dezPrimeiros = Object.keys(this.topHabilidades)
            dezPrimeiros.forEach((element, index) => {

              if (index > 9) {
                delete this.topHabilidades[element];
                return;
              }
              if (this.topHabilidades[element] === 0) {
                delete this.topHabilidades[element];
              }
            })

            this.tHarray = Object.keys(this.topHabilidades);
          })

      })
  }

  openTab(nome: any) {
    if (nome === 'last') {
      nome = this.windowService.getTab();
    }
    // this.windowOn.emit(false)
    this.windowService.setTabSelecionada(this.tabs[nome].url, nome);
    this.router.navigate([`/w/${this.tabs[nome].url}`])
  }

  abrirTab(tab: string) {
    // this.windowOn.emit(false)
    this.windowService.setTabSelecionada(this.tabs[tab].url, tab);
    this.router.navigate([`/w/${this.tabs[tab].url}`])

  }

}


