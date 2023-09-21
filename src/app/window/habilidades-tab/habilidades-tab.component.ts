import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, Subscription, take, tap } from 'rxjs';
import { onAndOff, onOff } from '../transitions';
import { PersonagemService } from 'src/app/personagem.service';
import { TabCtrlService } from '../tab-ctrl.service';
import { PanelCtrlService } from 'src/app/panel-ctrl-service.service';
import { IHabilidades } from 'src/app/IHabilidades';
import habilidadesTitulos from 'src/data/habilidades.json';
import tabsSide from 'src/data/side-tab.json';

@Component({
  selector: 'app-habilidades-tab',
  templateUrl: './habilidades-tab.component.html',
  styleUrls: ['./habilidades-tab.component.scss'],
  animations: [
    onOff, onAndOff
  ]
})
export class HabilidadesTabComponent implements OnInit, OnDestroy {

  imgs = ['pontaria',
    'sabedoria',
    'agilidade',
    'atletismo',
    'forca',
    'inteligencia',
    'minero']
  habPraPegar: any = {
    "principal": {
      "vida": '',
      "energia": '',
      "saciedade": '',
      "hidratacao": '',
      "sanidade": '',
      "dinheiro": '',
    },
    "fisico": {
      "forca": '',
      "agilidade": '',
      "atletismo": '',
      "destreza": '',
      "pontaria": '',
      "intimidacao": '',
      "bloqueio": '',
      "esquiva": '',
      "resistencia": '',
    },
    "mental":
    {
      "inteligencia": '',
      "resiliencia": '',
      "vontade": '',
      "sentirMotivacao": '',
      "iniciativa": '',
      "sabedoria": '',
      "percepcao": '',
      "carisma": '',
      "diplomacia": '',
      "enganacao": '',
      "furtividade": ''
    }
  }
  newSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;
  depoisDaMudancaSubscription: Subscription = new Subscription;
  infoComplementaresSubscription: Subscription = new Subscription;
  persona: any;
  habArray: any;
  habilidades: any = habilidadesTitulos;
  tabsSide: any = tabsSide.tabsSide;
  tabAtivo: string = 'principal';
  categorias: any = ['principal', 'fisico', 'mental']
  categoriasTitulo: any = ['Principal', 'Físico', 'Mental', 'Atualizados']
  pontos: any;
  mudados: any = {}; // objeto que guarda o valor antes da primeira mudança
  mudadosArray: any = Array<any>(); // array que guarda o nome dos atributos mudados para o tab 'atualizados'
  mudadosUpdt: any = {}; // objeto que guarda o valor da mudança na outra tab para enviar ao tab 'atualizados'
  mudadosAssunto: any = {}; // objeto que guarda o nome das tabs de cada atributo mudado
  loading: boolean = true;
  selecionadoEForaDaCaixa: boolean = false;
  selecionadoNome: string = '';
  interval: any;
  infosObject: any = {};
  imagensObject: any = {
    "0": { "img": "forca.png" }
  };

  constructor(private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService,
    private panelService: PanelCtrlService) {
    this.pontos = this.habPraPegar[this.tabAtivo];
    this.mudadosArray = Object.keys(this.mudados);
    this.clearSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.reverterTudo();
        this.mudados = {};
        this.mudadosArray = [];
        this.mudadosUpdt = {};
        this.mudadosAssunto = {};
        this.infosObject = {};
        this.selecionadoNome = '';
        this.selecionadoEForaDaCaixa = false
        this.persona = {};
        window.clearInterval(this.interval);

        this.categorias.splice(this.categorias.indexOf("atualizados"), 1);
        if (this.tabAtivo === "atualizados") {
          this.tabAtivo = this.categorias[0];
          this.habArray = Object.keys(this.habPraPegar[this.tabAtivo]);
          this.pontos = this.habPraPegar[this.tabAtivo];
        }
      })

    this.enviarMudancasSubscription = tabCtrlService.enviarMudancasReceive()
      .subscribe((data) => {
        if (data !== "atri") {
          return;
        }

        if (this.mudadosUpdt !== undefined || this.mudadosUpdt !== null) {
          this.habArray = [];
          this.loading = true;
          Object.keys(this.mudadosUpdt).forEach(atributo => {
            if (typeof this.mudadosUpdt[atributo] !== 'number') {
              delete this.mudadosUpdt[atributo];
            }
          })
          personagemService.putPersonagem(this.mudadosUpdt)
          this.putSubscription = personagemService.getPutResposta()
            .pipe(take(1))
            .subscribe(() => {
              this.tabCtrlService.UndoMudancasSend();
              this.iniciar();
            })
        }
      })

  }

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.tabCtrlService.ClearStateSend();
    this.newSubscription.unsubscribe();
    this.clearSubscription.unsubscribe();
    this.enviarMudancasSubscription.unsubscribe();
    this.putSubscription.unsubscribe();
    this.depoisDaMudancaSubscription.unsubscribe();
    this.infoComplementaresSubscription.unsubscribe();
    this.personagemService.limparPersonagem();
  }

  mouseIn(habilidade: string) {
    if (this.selecionadoEForaDaCaixa === false) {
      this.panelService.mouseEnteredSend('atributos', this.habilidades[habilidade]);
    }
  }

  mouseOff(habilidade: string) {
    if (this.selecionadoNome === habilidade) { this.selecionadoEForaDaCaixa = true; }
  }

  desativaInfo() {
    if (this.selecionadoEForaDaCaixa === true) { this.selecionadoNome = ''; this.selecionadoEForaDaCaixa = false }
  }

  teste(bla: any) {
    alert(JSON.parse(JSON.stringify(bla)))
  }


  iniciar() {
    this.infoComplementaresSubscription = this.panelService.getInfos('atributos')
      .subscribe((atributosData: any) => {
        this.infosObject = atributosData;
        this.infosObject.forEach((atributos: any) => {
          if (atributos.img !== "") {
            this.imagensObject[atributos.nome] = {};
            this.imagensObject[atributos.nome].img = atributos.img;
            console.log('this.imagensObject')
            if (this.imagensObject['0']) {
              delete this.imagensObject['0'];
            }
          }

        });

        this.newSubscription = this.personagemService.getPersonagem()
          .subscribe((data: any) => {
            var personagem = data;
            this.personagemService.setPersonagem(data)


            this.panelService.setInfosObj(this.infosObject);
            this.panelService.hoverInfoSend(true);
            this.persona = data.informacoesPersonagem;


            Object.keys(this.habPraPegar).forEach((categoria => {
              Object.keys(this.habPraPegar[categoria]).forEach(skill => {
                if (Object.keys(this.persona).includes(skill)) {
                  this.habPraPegar[categoria][skill] = this.persona[skill];
                } else {
                  this.habPraPegar[categoria][skill] = personagem[skill];
                }
              })
              if (categoria !== "principal") {
                this.habPraPegar[categoria] = Object.fromEntries(
                  Object.entries(this.habPraPegar[categoria]).sort(([, a]: any, [, b]: any) => b - a)
                );
              }
            }
            ))
            this.habArray = Object.keys(this.habPraPegar[this.tabAtivo]);
            this.pontos = this.habPraPegar[this.tabAtivo];
            this.loading = false;
          })

      })

  }



  switchSideTab(tab: any) {
    if (tab !== this.tabAtivo && tab !== "atualizados") {
      this.tabAtivo = tab;
      this.habArray = Object.keys(this.habPraPegar[this.tabAtivo]);
      this.pontos = this.habPraPegar[this.tabAtivo];
    } else if (tab === "atualizados") {
      this.tabAtivo = tab;
      this.habArray = this.mudadosArray;
      this.pontos = this.mudadosUpdt;
    }
  }

  editarOn(habilidade: string) {
    if (this.selecionadoNome !== habilidade) {
      this.selecionadoEForaDaCaixa = false;
      this.selecionadoNome = habilidade;
      this.panelService.mouseEnteredSend('atributos', this.habilidades[habilidade]);
    }
  }

  pontosSomar(habilidade: any) {
    if (!Object.keys(this.mudados).includes(habilidade)) { //para checar se essa é a primeira mudança
      this.mudados[habilidade] = this.habPraPegar[this.tabAtivo][habilidade];
      this.mudadosArray.push(habilidade);
      this.mudadosAssunto[habilidade] = this.tabAtivo;
      if (this.tabCtrlService.mostrarBotoesGet() !== true) {
        this.tabCtrlService.buttonsOnSend();
        this.tabCtrlService.reqButtonStateSend(true);
      }

      if (!this.categorias.includes("atualizados")) {
        this.categorias.push("atualizados");
      }
    }
    if (Object.keys(this.habPraPegar).includes(this.tabAtivo)) { //para ignorar o tab 'atualizados'
      this.habPraPegar[this.tabAtivo][habilidade]++;
      this.mudadosUpdt[habilidade] = this.habPraPegar[this.tabAtivo][habilidade];
    } else {
      this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade]++;
      this.mudadosUpdt[habilidade] = this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade];
    }
    if (this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade] === this.mudados[habilidade]) {
      this.reverter(habilidade);
    }
    // this.mudancaPontos = true;
    Object.keys(this.mudadosUpdt).forEach(atributo => {
      this.persona[atributo] = this.mudadosUpdt[atributo];
    })

  }
  pontosDiminuir(habilidade: any) {
    if (!Object.keys(this.mudados).includes(habilidade)) {
      this.mudados[habilidade] = this.habPraPegar[this.tabAtivo][habilidade];
      this.mudadosArray.push(habilidade);
      this.mudadosAssunto[habilidade] = this.tabAtivo;
      if (this.tabCtrlService.mostrarBotoesGet() !== true) {
        this.tabCtrlService.buttonsOnSend();
        this.tabCtrlService.reqButtonStateSend(true);
      }

      if (!this.categorias.includes("atualizados")) {
        this.categorias.push("atualizados");
      }
    }
    if (Object.keys(this.habPraPegar).includes(this.tabAtivo)) {
      this.habPraPegar[this.tabAtivo][habilidade]--;
      this.mudadosUpdt[habilidade] = this.habPraPegar[this.tabAtivo][habilidade];
    } else {
      this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade]--;
      this.mudadosUpdt[habilidade] = this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade];
    }
    if (this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade] === this.mudados[habilidade]) {
      this.reverter(habilidade);
    }
  }

  reverter(habilidade: any) {
    if (Object.keys(this.habPraPegar).includes(this.tabAtivo)) { //se nao estiver no tab 'atualizados'
      this.habPraPegar[this.tabAtivo][habilidade] = this.mudados[habilidade];
    } else {
      this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade] = this.mudados[habilidade];
    }

    this.mudadosArray.splice(this.mudadosArray.indexOf(habilidade), 1);
    delete this.mudados[habilidade];
    if (this.mudadosArray.length === 0) {
      this.tabCtrlService.ClearStateSend();
      this.categorias.splice(this.categorias.indexOf("atualizados"), 1);
      if (this.tabAtivo === "atualizados") {
        this.tabAtivo = this.categorias[0];
      }
      this.habArray = Object.keys(this.habPraPegar[this.tabAtivo]);
      this.pontos = this.habPraPegar[this.tabAtivo];
    }
  }

  reverterTudo() {
    this.mudadosArray.forEach((element: any) => {
      this.habPraPegar[this.mudadosAssunto[element]][element] = this.mudados[element];
    });
  }

  initInterval(tipo: string, habilidade: any) {
    if (!this.interval) {
      if (tipo === 'somar') {
        this.interval = setInterval(() => {
          this.pontosSomar(habilidade);
        }, 200);
      } else {
        this.interval = setInterval(() => {
          this.pontosDiminuir(habilidade);
        }, 200)
      }
    }
  }

  clearInterval() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }

  mudouSeAlgo(habilidade: any, evento: any) {

    var pontoCorreto = evento.target.value;
    if (habilidade === 'dinheiro') {
      pontoCorreto = pontoCorreto.replace(',', '.');
      var numComPonto = pontoCorreto.split('.');
      var numComDecimalSeparado = numComPonto.splice(-1, 1);
      numComPonto.join('');
      pontoCorreto = numComPonto + '.' + numComDecimalSeparado;

    } else {
      pontoCorreto = pontoCorreto.replace(',', '.');
      pontoCorreto = pontoCorreto.split('.')[0];
    }

    var numeroFormatado = Number(pontoCorreto.replace(/[^0-9.-]+/g, ""));
    evento.target.value = numeroFormatado;

    if (!Object.keys(this.mudados).includes(habilidade)) { //para checar se essa é a primeira mudança
      this.mudados[habilidade] = this.habPraPegar[this.tabAtivo][habilidade];
      this.mudadosArray.push(habilidade);
      this.mudadosAssunto[habilidade] = this.tabAtivo;
      if (this.tabCtrlService.mostrarBotoesGet() !== true) {
        this.tabCtrlService.buttonsOnSend();
        this.tabCtrlService.reqButtonStateSend(true);
      }

      if (!this.categorias.includes("atualizados")) {
        this.categorias.push("atualizados");
      }
    }

    this.pontos[habilidade] = numeroFormatado;
    this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade] = this.pontos[habilidade];
    this.mudadosUpdt[habilidade] = this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade];

    if (this.habPraPegar[this.mudadosAssunto[habilidade]][habilidade] === this.mudados[habilidade]) {
      this.reverter(habilidade);
    }

    Object.keys(this.mudadosUpdt).forEach(atributo => {
      this.persona[atributo] = this.mudadosUpdt[atributo];
    })

  }



}
