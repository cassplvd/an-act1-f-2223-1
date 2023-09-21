import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelCtrlService } from '../panel-ctrl-service.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, AnimationEvent, state } from '@angular/animations';

@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.scss'],
  animations: [
    trigger('inOut', [
      transition(':enter',
        [
          style({ opacity: 0 }),
          animate('60ms ease-out',
            style({ opacity: 1 }))
        ]
      ),
      transition(':leave',
        [
          style({ opacity: 1 }),
          animate('0ms ease-in',
            style({ opacity: 0 }))
        ]
      )
    ])
  ]
})
export class PanelRightComponent implements OnInit, OnDestroy {

  mouseEnterSubscription: Subscription = new Subscription;
  hoverInfoSubscription: Subscription = new Subscription;
  getInfosSubscription: Subscription = new Subscription;
  categoriaSubscription: Subscription = new Subscription;
  dadoSubscription: Subscription = new Subscription;
  infosExternasSubscription: Subscription = new Subscription;
  localSubscription: Subscription = new Subscription;
  hoverInfo: boolean = false;
  categoria: string = 'atributos';
  dado: string = 'invalido';
  infosObject: any = {};
  infosExternasObject: any = {};
  titulo: string = '';
  descricao: string = '';
  img: string = '';
  categoriaTitulo: string = 'Atributos';
  categoriasTitulos: any = {
    'atributos': 'Atributos',
    'pericias': 'Perícias',
    'talentos': 'Talentos',
    'inventario': 'Inventário',
    'identidade': 'Identidade',
    'historia': 'História'
  };
  mudou: boolean = false;
  atualizarMudancas: boolean = false;
  indexInteracao: number = 0;
  mesmoDado: boolean = false;
  mesmaCategoria: boolean = false;
  localAtivo: number = 0;
  jogadores: any;
  localInfos: any;
  localSelecionado: any = {};


  constructor(private panelService: PanelCtrlService) {

    this.dadoSubscription = panelService.receiveDado()
      .subscribe(data => {
        if (this.dado !== String(data)) {
          this.dado = String(data);
          this.mesmoDado = false;
        } else {
          this.mesmoDado = true;
        }
      })

    this.categoriaSubscription = panelService.receiveCategoria()
      .subscribe(data => {
        if (this.categoria !== String(data)) {
          this.categoria = String(data);
          this.categoriaTitulo = this.categoriasTitulos[this.categoria]
          this.mesmaCategoria = false;
        } else {
          this.mesmaCategoria = true;
        }
      })

    this.hoverInfoSubscription = panelService.hoverInfoReceive()
      .subscribe(data => {
        this.hoverInfo = Boolean(data);
        if (this.hoverInfo === true) {
          this.infosObject = panelService.getInfosObj()
        } else {
          this.iniciar()
        }
      })

    this.mouseEnterSubscription = panelService.mouseEnteredReceive()
      .subscribe(() => {
        if (this.mesmoDado === true && this.mesmaCategoria === true) {
          return;
        }
        if (this.dado !== "invalido") {
          this.inserirInfosComplementares()
        }
      })

    this.localSubscription = panelService.mudancaLocalSelecionadoReceive()
      .subscribe((data: any) => {
        this.localSelecionado = this.localInfos[data];
      })

  }

  ngOnInit(): void {
    this.iniciar()
  }

  ngOnDestroy(): void {
    this.mouseEnterSubscription.unsubscribe();
    this.hoverInfoSubscription.unsubscribe();
    this.getInfosSubscription.unsubscribe();
    this.categoriaSubscription.unsubscribe();
    this.dadoSubscription.unsubscribe();
    this.localSubscription.unsubscribe();
    this.infosExternasSubscription.unsubscribe();
  }

  inserirInfosComplementares() {
    this.infosObject.forEach((elemento: any) => {
      if (elemento.nome === this.dado) {
        if (elemento.descricao !== '' && elemento.img !== '') {
          this.titulo = this.dado;
          this.descricao = elemento.descricao;
          this.img = elemento.img;
        } else {
          this.dado = 'invalido';
        }
      }
    })
  }

  iniciar() {
    this.infosExternasSubscription = this.panelService.getInfos('infosExternas')
      .subscribe((data: any) => {
        this.panelService.setInfosObj(data);
        this.jogadores = data.jogadores;
        this.localInfos = data.local;
        this.localSelecionado = this.localInfos[this.localAtivo]
      })
  }


}
