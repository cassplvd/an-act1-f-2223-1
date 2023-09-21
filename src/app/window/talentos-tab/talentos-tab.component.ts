import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PersonagemService } from 'src/app/personagem.service';
import { TabCtrlService } from '../tab-ctrl.service';
import { WindowCtrlService } from 'src/app/window-ctrl.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../change-dialog/change-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { onOff } from '../transitions';
import { PanelCtrlService } from 'src/app/panel-ctrl-service.service';
import { ExcluirDialogComponent } from 'src/app/excluir-dialog/excluir-dialog.component';

@Component({
  selector: 'app-talentos-tab',
  templateUrl: './talentos-tab.component.html',
  styleUrls: ['./talentos-tab.component.scss'],
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
export class TalentosTabComponent implements OnInit, OnDestroy {

  newSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;
  infoComplementaresSubscription: Subscription = new Subscription;
  depoisDaMudancaSubscription: Subscription = new Subscription;
  talentoArray: any = [];
  loading: boolean = true;
  objDeAlteracoes: any = {
    "novo": {},
    "editar": {}
  }
  talentoComoObj: any = {};
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
  talentosCriados: any = [];
  semImagem: any = [];
  semDescricao: any = [];
  erroRepeticao: boolean = false;
  erroVazio: boolean = false;





  constructor(private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService,
    public dialog: MatDialog,
    private panelService: PanelCtrlService) {
    this.clearSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.loading = true;
        this.talentoArray = [];
        this.objDeAlteracoes = {
          "novo": {},
          "editar": {}
        };
        this.talentoComoObj = {};
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
        this.talentosCriados = [];
        this.semImagem = [];
        this.semDescricao = [];
        this.erroRepeticao = false;
        this.erroVazio = false;


        this.pegarInfoPersonagem();
        panelService.hoverInfoSend(true);

      })
    this.enviarMudancasSubscription = tabCtrlService.enviarMudancasReceive()
      .subscribe(() => {
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
          Object.keys(this.objDeAlteracoes.editar).forEach(talentoIndex => {
            this.talentoArray[this.acharIndex(Number(talentoIndex))] = this.objDeAlteracoes.editar[talentoIndex].nome;

            var infoPack = {
              "nome": this.objDeAlteracoes.editar[talentoIndex].nome,
              "descricao": this.objDeAlteracoes.editar[talentoIndex].descricao,
              "img": this.objDeAlteracoes.editar[talentoIndex].img,
              "id": this.objDeAlteracoes.editar[talentoIndex].id
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

        panelService.aplicarMudancas('talentos', mudancaObj);
        var putData = { 'talentosList': this.talentoArray }
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
    this.infoComplementaresSubscription = this.panelService.getInfos('talentos')
      .subscribe((data: any) => {
        this.infosObject = data;
        this.newSubscription = this.personagemService.getPersonagem()
          .subscribe((data: any) => {
            this.personagemService.setPersonagem(data)
            this.talentoArray = data['talentosList'];
            this.panelService.setInfosObj(this.infosObject);
            this.panelService.hoverInfoSend(true);
            this.talentoArray.forEach((element: any, index: number) => {
              this.talentoComoObj[index] = {};
              this.talentoComoObj[index].nome = element;
              this.talentoComoObj[index].img = "";
              this.talentoComoObj[index].descricao = "";
              this.contadorArray.push(index);
              this.infosObject.forEach((infoSobreTalento: any) => {
                if (infoSobreTalento.nome === element) {
                  infoSobreTalento.img ? this.talentoComoObj[index].img = infoSobreTalento.img : this.semImagem.push(element);
                  infoSobreTalento.descricao ? this.talentoComoObj[index].descricao = infoSobreTalento.descricao : this.semDescricao.push(element);
                  this.talentoComoObj[index].id = infoSobreTalento.id;
                }
              });
            });
            this.loading = false;
          })
      })

  }

  ativarAlteracao(tipo: string, talento: string = "none", index: number = -1) {
    this.erroRepeticao = false;
    this.erroVazio = false;


    if (this.editBoxState === false && this.talentosCriados.includes(talento) === false) {

      if (talento === 'none') {
        var objetoArray = Object.keys(this.objDeAlteracoes['novo']);
        var indexTemp = 0;
        this.alterarAtual = 0;
        if (objetoArray.length > 0) {
          indexTemp = Number(objetoArray.at(-1)) + 1;
          this.alterarAtual = indexTemp;
        }
        this.tipoAtual = 'novo';
        this.objDeAlteracoes['novo'][this.alterarAtual] = {
          'tipo': tipo,
          'nome': '',
          "descricao": "",
          "img": ""
        };

      } else {
        this.objAtual = this.acharIndex(index);
        this.tipoAtual = 'editar';
        this.alterarAtual = index;

        if (!Object.keys(this.objDeAlteracoes['editar']).includes(String(index))) {
          this.objDeAlteracoes['editar'][index] = {
            'tipo': tipo,
            'nome': talento,
            'img': this.talentoComoObj[this.objAtual].img,
            'descricao': this.talentoComoObj[this.objAtual].descricao,
            'id': this.talentoComoObj[this.objAtual].id

          };
        }
        Object.keys(this.talentoComoObj[this.objAtual]).forEach((talentoI: string) => {
          if (this.talentoComoObj[this.objAtual][talentoI] !== this.objDeAlteracoes['editar'][index][talentoI]) {
            this.undoBotao[talentoI] = true;
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
    var indexTalento = Number(Object.keys(this.talentoComoObj).find(n => this.talentoComoObj[n].id === id));
    return indexTalento
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
      var paraDeletar = 1024;
      Object.keys(this.talentoComoObj[this.objAtual]).forEach((talentoI: string) => {
        if (this.talentoComoObj[this.objAtual][talentoI] !== this.objDeAlteracoes['editar'][this.alterarAtual][talentoI]) {
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
      if (this.talentoComoObj[this.objAtual][tipo] !== this.objDeAlteracoes['editar'][this.alterarAtual][tipo]) {
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
      return;
    }
    var index = this.contadorArray.at(-1) + 1;
    if (this.checarRepeticao()) {
      this.erroRepeticao = true;
      return
    }
    this.talentoComoObj[index] = {};
    this.talentoComoObj[index].nome = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome;
    this.talentoComoObj[index].img = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].img;
    this.talentoComoObj[index].descricao = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].descricao;
    var ultimoTalento: any = Object.keys(this.talentoComoObj).at(-1);
    var ultimoId: any = this.talentoComoObj[ultimoTalento];
    this.novosIds[index] = {};
    this.novosIds[index].id = Number(ultimoId) + 1;
    this.contadorArray.push(index);
    this.talentoArray.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.talentosCriados.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
    this.limparTudo()
    this.editBoxState = false;
    this.limparUndoBotoes();
    if (this.tabCtrlService.habilitarBotoesGet() !== true) {
      this.tabCtrlService.reqButtonStateSend(true);
    }
  }



  excluir() {
    this.talentoArray.splice(Number(this.objAtual), 1);
    this.contadorArray = [];
    var novotalentoObj: any = {};
    this.idsExcluidos.push(this.talentoComoObj[this.objAtual].id);
    delete this.talentoComoObj[this.objAtual];
    Object.keys(this.talentoComoObj).forEach((talento: any, index: number) => {
      novotalentoObj[index] = {};
      Object.keys(this.talentoComoObj[talento]).forEach(dado => {
        novotalentoObj[index][dado] = this.talentoComoObj[talento][dado];
      });
      this.contadorArray.push(index);
    });

    this.talentoComoObj = {};
    Object.keys(novotalentoObj).forEach((talento: any, index: number) => {
      this.talentoComoObj[index] = {};
      this.talentoComoObj[index].nome = novotalentoObj[index].nome
      this.talentoComoObj[index].img = novotalentoObj[index].img
      this.talentoComoObj[index].descricao = novotalentoObj[index].descricao
      this.talentoComoObj[index].id = novotalentoObj[index].id
    })
    novotalentoObj = {};

    if (this.objDeAlteracoes['editar'][this.alterarAtual]) {
      delete this.objDeAlteracoes['editar'][this.alterarAtual];
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
    var novoDado = this.talentoComoObj[this.objAtual][tipoDado];
    this.objDeAlteracoes[this.tipoAtual][this.alterarAtual][tipoDado] = novoDado;
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
        this.disabilitarBotoes();
      }
    })
  }

  excluirCheck(titulo: string) {
    const dialogRef = this.dialog.open(ExcluirDialogComponent, {
      width: '350px',
      height: '350px',
      data: { titulo: titulo, tipo: "dos seus talentos" }
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


  mouseIn(talento: any) {

    if (!this.talentosCriados.includes(talento) && !this.semImagem.includes(talento) && !this.semDescricao.includes(talento)) {
      this.panelService.mouseEnteredSend('talentos', talento)
    } else {
      this.panelService.mouseEnteredSend('talentos', 'invalido')
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
    Object.keys(this.talentoComoObj).forEach(talento => {
      if (this.talentoComoObj[talento].nome === this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome) {
        var indice = this.acharIndex(this.alterarAtual);
        if (Number(talento) !== indice) {
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
