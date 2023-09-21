import { Component, OnDestroy, OnInit } from '@angular/core';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { TabCtrlService } from '../tab-ctrl.service';
import { PersonagemService } from 'src/app/personagem.service';
import { Subscription, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../change-dialog/change-dialog.component';
import { onOff } from '../transitions';
import { PanelCtrlService } from 'src/app/panel-ctrl-service.service';
import { ExcluirDialogComponent } from 'src/app/excluir-dialog/excluir-dialog.component';

@Component({
  selector: 'app-pericias-tab',
  templateUrl: './pericias-tab.component.html',
  styleUrls: ['./pericias-tab.component.scss'],
  animations: [
    trigger('editOn', [
      state('show', style({
        'opacity': '1'
      })),
      state('hide', style({
        'opacity': '0'
      })),
      transition('show => hide', animate('400ms ease')),
      transition('hide => show', animate('400ms ease'))
    ]),
    onOff
  ]
})
export class PericiasTabComponent implements OnInit, OnDestroy {

  newSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;
  infoComplementaresSubscription: Subscription = new Subscription;
  depoisDaMudancaSubscription: Subscription = new Subscription;
  periciaArray: any = [];
  loading: boolean = true;
  objDeAlteracoes: any = {
    "novo": {},
    "editar": {}
  }
  periciaComoObj: any = {};
  editBoxState: boolean = false;
  arrayMudancas: any = [];
  contadorArray: any = [];
  objAtual: any;
  alterarAtual: any;
  tipoAtual: any;
  undoBotao: any = {
    nome: false,
    img: false,
    descricao: false
  };
  mudadosArray: any = [];
  novosArray: any = [];
  infosObject: any;
  infosComplementaresObj: any = {};
  dadoAtual: string = '';
  novosIds: any = [];
  idsExcluidos: any = [];
  periciasCriadas: any = [];
  semImagem: any = [];
  semDescricao: any = [];
  erroRepeticao: boolean = false;
  erroVazio: boolean = false;



  constructor(private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService,
    public dialog: MatDialog,
    private panelService: PanelCtrlService
  ) {
    this.clearSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.loading = true;
        this.periciaArray = [];
        this.objDeAlteracoes = {
          "novo": {},
          "editar": {}
        };
        this.periciaComoObj = {};
        this.editBoxState = false;
        this.arrayMudancas = [];
        this.contadorArray = [];
        this.objAtual = 0;
        this.alterarAtual = 0;
        this.tipoAtual = '';
        this.undoBotao = {
          nome: false,
          img: false,
          descricao: false
        };
        this.mudadosArray = [];
        this.novosArray = [];
        this.infosObject = {};
        this.infosComplementaresObj = {};
        this.dadoAtual = '';
        this.novosIds = [];
        this.idsExcluidos = [];
        this.periciasCriadas = [];
        this.semImagem = [];
        this.semDescricao = [];
        this.erroRepeticao = false;
        this.erroVazio = false;


        this.pegarInfoPersonagem();
        panelService.hoverInfoSend(true);

      })

    this.enviarMudancasSubscription = tabCtrlService.enviarMudancasReceive()
      .subscribe((data) => {
        this.loading = true;
        var mudancaObj: any = {};
        mudancaObj.praDeletar = [];
        mudancaObj.praAlterar = [];
        mudancaObj.praAdicionar = [];


        if (Object.keys(this.objDeAlteracoes.novo).length > 0) {
          Object.keys(this.objDeAlteracoes.novo).forEach(novoId => {
            var infoPack = {
              "nome": this.objDeAlteracoes.novo[novoId].nome,
              "descricao": this.objDeAlteracoes.novo[novoId].descricao,
              "img": this.objDeAlteracoes.novo[novoId].img,
            }
            mudancaObj.praAdicionar.push(infoPack);
          })
        }

        if (this.mudadosArray.length > 0) {
          Object.keys(this.objDeAlteracoes.editar).forEach(periciaIndex => {
            this.periciaArray[this.acharIndex(Number(periciaIndex))] = this.objDeAlteracoes.editar[periciaIndex].nome;

            var infoPack = {
              "nome": this.objDeAlteracoes.editar[periciaIndex].nome,
              "descricao": this.objDeAlteracoes.editar[periciaIndex].descricao,
              "img": this.objDeAlteracoes.editar[periciaIndex].img,
              "id": this.objDeAlteracoes.editar[periciaIndex].id
            }

            mudancaObj.praAlterar.push(infoPack);

          })
        }

        if (this.idsExcluidos.length > 0) {
          this.idsExcluidos.forEach((excluirId: any) => {
            var infoPack = {
              "id": excluirId
            }
            mudancaObj.praDeletar.push(infoPack);
          });
        }

        panelService.aplicarMudancas('pericias', mudancaObj);
        var putData = { 'periciaList': this.periciaArray }
        personagemService.putPersonagem(putData);

      })

    this.depoisDaMudancaSubscription = panelService.fimMudancaReceive()
      .subscribe(() => {
        this.tabCtrlService.UndoMudancasSend();
      })
  }

  ngOnInit(): void {
    this.pegarInfoPersonagem();
  }

  ngOnDestroy(): void {
    this.newSubscription.unsubscribe();
    this.clearSubscription.unsubscribe();
    this.enviarMudancasSubscription.unsubscribe();
    this.putSubscription.unsubscribe();
    this.infoComplementaresSubscription.unsubscribe();
    this.depoisDaMudancaSubscription.unsubscribe();
    this.personagemService.limparPersonagem();
  }


  pegarInfoPersonagem() {
    this.infoComplementaresSubscription = this.panelService.getInfos('pericias')
      .subscribe((data: any) => {
        this.infosObject = data;
        this.newSubscription = this.personagemService.getPersonagem()
          .subscribe((data: any) => {
            this.personagemService.setPersonagem(data)


            this.periciaArray = data['periciaList'];
            this.panelService.setInfosObj(this.infosObject);
            this.panelService.hoverInfoSend(true);
            this.periciaArray.forEach((element: any, index: number) => {
              this.periciaComoObj[index] = {};
              this.periciaComoObj[index].nome = element;
              this.periciaComoObj[index].img = "";
              this.periciaComoObj[index].descricao = "";
              this.contadorArray.push(index);
              this.infosObject.forEach((infoSobrePericia: any) => {
                if (infoSobrePericia.nome === element) {
                  infoSobrePericia.img ? this.periciaComoObj[index].img = infoSobrePericia.img : this.semImagem.push(element);
                  infoSobrePericia.descricao ? this.periciaComoObj[index].descricao = infoSobrePericia.descricao : this.semDescricao.push(element);
                  this.periciaComoObj[index].id = infoSobrePericia.id;
                }
              });
            });
            this.loading = false;
          })
      })

  }


  ativarAlteracao(tipo: string, pericia: string = "none", index: number = -1) {
    this.erroRepeticao = false;
    this.erroVazio = false;


    if (this.editBoxState === false && this.periciasCriadas.includes(pericia) === false) {


      if (pericia === 'none') { //se eu cliquei pra criar um novo
        var objetoArray = Object.keys(this.objDeAlteracoes['novo']);
        var indexTemp = 0;
        // this.objAtual = 0;
        this.alterarAtual = 0;
        if (objetoArray.length > 0) {
          indexTemp = Number(objetoArray.at(-1)) + 1;
          this.alterarAtual = indexTemp;
        }
        this.tipoAtual = 'novo';
        this.objDeAlteracoes['novo'][this.alterarAtual] = {
          "tipo": tipo,
          "nome": "",
          "descricao": "",
          "img": "",
        };

      } else {

        // this.objAtual = Number(Object.keys(this.periciaComoObj).find(n => this.periciaComoObj[n].id === index));

        // this.objAtual = index;
        this.tipoAtual = 'editar';
        this.objAtual = this.acharIndex(index);
        this.alterarAtual = index;

        if (!Object.keys(this.objDeAlteracoes['editar']).includes(String(index))) {
          this.objDeAlteracoes['editar'][index] = {
            'tipo': tipo,
            'nome': pericia,
            'descricao': this.periciaComoObj[this.objAtual].descricao,
            'img': this.periciaComoObj[this.objAtual].img,
            'id': this.periciaComoObj[this.objAtual].id,
          };
        }

        Object.keys(this.periciaComoObj[this.objAtual]).forEach((periciaI: string) => {
          if (this.periciaComoObj[this.objAtual][periciaI] !== this.objDeAlteracoes['editar'][index][periciaI]) {
            this.undoBotao[periciaI] = true;
          }
        })
      }

      this.editBoxState = true;
      if (this.tabCtrlService.mostrarBotoesGet() !== true) {
        this.tabCtrlService.buttonsOnSend();
      }
    }
  }

  acharIndex(id: number) {
    var indexPericia = Number(Object.keys(this.periciaComoObj).find(n => this.periciaComoObj[n].id === id));
    return indexPericia
  }

  fecharAlteracao() {
    this.erroRepeticao = false;
    this.erroVazio = false;

    var parar: boolean = false;
    var impedir: boolean = false;

    if (this.checarRepeticao()) {
      this.erroRepeticao = true;
      impedir = true;
    } else {
      this.erroRepeticao = false;
    }

    if (impedir === true) {
      return
    }


    if (this.tipoAtual === 'editar') {
      var paraDeletar = this.objAtual;
      Object.keys(this.periciaComoObj[this.objAtual]).forEach((periciaI: string) => {
        if (this.periciaComoObj[this.objAtual][periciaI] !== this.objDeAlteracoes['editar'][this.alterarAtual][periciaI]) {
          paraDeletar = 1024;
        }
      })

      if (this.objDeAlteracoes['editar'][this.alterarAtual].nome === "") {
        paraDeletar = 1024;
        parar = true;
        this.erroVazio = true;

      }

      if (paraDeletar !== 1024) {
        delete this.objDeAlteracoes['editar'][this.alterarAtual];
      }

    } else {
      if (this.novosArray.length > 0) {
        parar = true;
      }
      if (parar !== true) {
        delete this.objDeAlteracoes['novo'][this.alterarAtual];
        this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
      } else {
        this.alerta();
      }
    }
    if (parar !== true) {
      this.editBoxState = false;
      this.limparUndoBotoes();
    } else {
      return
    }
    this.disabilitarBotoes();

  }

  mudouSeAlgo(evento: any, tipo: string) {
    this.dadoAtual = tipo;
    if (this.tipoAtual === 'editar') {
      if (this.periciaComoObj[this.objAtual][tipo] !== this.objDeAlteracoes['editar'][this.alterarAtual][tipo]) {
        this.undoBotao[tipo] = true;
        this.tabCtrlService.reqButtonStateSend(true);
        if (!this.mudadosArray.includes(this.tipoAtual + this.alterarAtual + tipo)) {
          this.mudadosArray.push(this.tipoAtual + this.alterarAtual + tipo);
        }
      } else {
        this.undoBotao[tipo] = false;
        this.mudadosArray.splice(this.mudadosArray.indexOf(this.tipoAtual + this.alterarAtual + tipo), 1);
      }
    } else {
      if (evento !== '') {
        if (!this.novosArray.includes(this.tipoAtual + this.alterarAtual)) {
          this.novosArray.push(this.tipoAtual + this.alterarAtual);
          this.tabCtrlService.reqButtonStateSend(true);
        }
      } else {
        if (this.novosArray.includes(this.tipoAtual + this.alterarAtual)) {
          this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
        }

      }
    }
    this.limparTudo();
  }


  criar() {
    this.erroRepeticao = false;
    this.erroVazio = false;

    if (this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome === "") {
      this.erroVazio = true;
      return
    }
    var index = this.contadorArray.at(-1) + 1;
    if (this.checarRepeticao()) {
      this.erroRepeticao = true;
      return
    }
    this.periciaComoObj[index] = {};
    this.periciaComoObj[index].nome = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome;
    this.periciaComoObj[index].img = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].img;
    this.periciaComoObj[index].descricao = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].descricao;
    var ultimoPericia: any = Object.keys(this.periciaComoObj).at(-1);
    var ultimoId: any = this.periciaComoObj[ultimoPericia];
    this.novosIds[index] = {};
    this.novosIds[index].id = Number(ultimoId) + 1;
    this.contadorArray.push(index);
    this.periciaArray.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.periciasCriadas.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
    this.limparTudo()
    this.editBoxState = false;
    this.limparUndoBotoes();
    if (this.tabCtrlService.habilitarBotoesGet() !== true) {
      this.tabCtrlService.reqButtonStateSend(true);
    }
  }

  excluir() {
    this.periciaArray.splice(Number(this.objAtual), 1);
    this.contadorArray = [];
    var novoPericiaObj: any = {};
    this.idsExcluidos.push(this.periciaComoObj[this.objAtual].id);
    delete this.periciaComoObj[this.objAtual];
    Object.keys(this.periciaComoObj).forEach((pericia: any, index: number) => {
      novoPericiaObj[index] = {};
      Object.keys(this.periciaComoObj[pericia]).forEach(dado => {
        novoPericiaObj[index][dado] = this.periciaComoObj[pericia][dado];
      });
      this.contadorArray.push(index);
    });

    this.periciaComoObj = {};
    Object.keys(novoPericiaObj).forEach((pericia: any, index: number) => {
      this.periciaComoObj[index] = {};
      this.periciaComoObj[index].nome = novoPericiaObj[index].nome
      this.periciaComoObj[index].img = novoPericiaObj[index].img
      this.periciaComoObj[index].descricao = novoPericiaObj[index].descricao
      this.periciaComoObj[index].id = novoPericiaObj[index].id
    })
    novoPericiaObj = {};

    if (this.objDeAlteracoes['editar'][this.alterarAtual]) {
      delete this.objDeAlteracoes['editar'][this.alterarAtual]
      if (this.mudadosArray.includes('editar' + this.alterarAtual + this.dadoAtual)) {
        this.mudadosArray.splice(this.mudadosArray.indexOf(this.tipoAtual + this.alterarAtual + this.dadoAtual), 1);
      }
    }
    this.editBoxState = false;
    this.limparUndoBotoes();
    this.limparTudo();
    if (this.tabCtrlService.habilitarBotoesGet() !== true) {
      this.tabCtrlService.reqButtonStateSend(true);
    }


  }

  reverter(tipoDado: string) {
    var novoDado = this.periciaComoObj[this.objAtual][tipoDado];
    this.objDeAlteracoes.editar[this.alterarAtual][tipoDado] = novoDado;
    this.undoBotao[tipoDado] = false;
    this.mudadosArray.splice(this.mudadosArray.indexOf(this.tipoAtual + this.alterarAtual + tipoDado), 1);
    this.limparTudo();
  }

  reverterTudo() {
    var tipos = ["nome", "descricao", "img"];
    tipos.forEach(tipo => {
      this.reverter(tipo);
    })
  }


  // ----------------------------------------------
  // FUNÇÕES DE UI


  alerta() {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '350px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result === "ok") {
        delete this.objDeAlteracoes.novo[this.alterarAtual];
        this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
        this.editBoxState = false;
        this.limparUndoBotoes();
        this.limparTudo();
        this.disabilitarBotoes()
      }
    })
  }

  excluirCheck(titulo: string) {
    const dialogRef = this.dialog.open(ExcluirDialogComponent, {
      width: '350px',
      height: '350px',
      data: { titulo: titulo, tipo: "das suas perícias" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result === "ok") {
        this.excluir();
      }
    })
  }


  ativarBotoes() {
    if (this.tabCtrlService.mostrarBotoesGet() !== true) {
      this.tabCtrlService.buttonsOnSend();
    }
  }


  disabilitarBotoes() {
    if (this.tabCtrlService.habilitarBotoesGet() === false) {
      this.tabCtrlService.ClearStateSend();
    }
  }


  mouseIn(pericia: any) {
    if (!this.periciasCriadas.includes(pericia) && !this.semImagem.includes(pericia) && !this.semDescricao.includes(pericia)) {
      this.panelService.mouseEnteredSend('pericias', pericia)
    } else {
      this.panelService.mouseEnteredSend('pericias', 'invalido')
    }
  }



  // --------------------------------------------
  // FUNÇÕES DE LÓGICA


  refazerObjeto(objetoParaLimpar: any) {
    var objetoTemporario: any = {};
    Object.keys(objetoParaLimpar).forEach((item: any, index: any) => {
      objetoTemporario[index] = {};
      Object.keys(objetoParaLimpar[item]).forEach((dado) => {
        objetoTemporario[index][dado] = objetoParaLimpar[item][dado];
      })
    })
    objetoParaLimpar = {};
    Object.keys(objetoTemporario).forEach((item: any, index: any) => {
      objetoParaLimpar[index] = {};
      Object.keys(objetoTemporario[item]).forEach((dado) => {
        objetoParaLimpar[index][dado] = objetoTemporario[item][dado];
      })
    })
    objetoTemporario = {};
    return objetoParaLimpar
  }

  checarRepeticao(): boolean {
    var repeticao: boolean = false;
    Object.keys(this.periciaComoObj).forEach(pericia => {
      if (this.periciaComoObj[pericia].nome === this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome) {

        var indice = this.acharIndex(this.alterarAtual);
        if (Number(pericia) !== indice) {
          repeticao = true;
        } else if (this.tipoAtual !== 'editar') {
          repeticao = true;
        }
      }
    });
    return repeticao
  }


  limparTudo() {
    if (this.mudadosArray.length < 1 && Object.values(this.novosIds).length < 1 && this.idsExcluidos.length < 1) {
      this.tabCtrlService.reqButtonStateSend(false);
    }
  }


  limparUndoBotoes() {
    Object.keys(this.undoBotao).forEach(undoElement => {
      this.undoBotao[undoElement] = false;
    })
  }



}
