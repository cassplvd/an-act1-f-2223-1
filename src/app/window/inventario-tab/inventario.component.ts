import { Component, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PersonagemService } from 'src/app/personagem.service';
import { TabCtrlService } from '../tab-ctrl.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../change-dialog/change-dialog.component';
import { editOn, inOutAnimation, onOff } from '../transitions';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PanelCtrlService } from 'src/app/panel-ctrl-service.service';
import { ExcluirDialogComponent } from 'src/app/excluir-dialog/excluir-dialog.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  animations: [editOn, inOutAnimation, onOff]
})
export class InventarioComponent implements OnInit {

  newSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;
  infoComplementaresSubscription: Subscription = new Subscription;
  depoisDaMudancaSubscription: Subscription = new Subscription;
  inventarioArray: any = [];
  loading: boolean = true;
  objDeAlteracoes: any = {
    "novo": {},
    "editar": {}
  }
  inventarioComoObj: any = {};
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
  itensCriados: any = [];
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
        this.inventarioArray = [];
        this.objDeAlteracoes = {
          "novo": {},
          "editar": {}
        };
        this.inventarioComoObj = {};
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
        this.itensCriados = [];
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
          Object.keys(this.objDeAlteracoes.editar).forEach(inventarioIndex => {
            var nome = this.objDeAlteracoes.editar[inventarioIndex].nome;
            this.inventarioArray[this.acharIndex(Number(inventarioIndex))] = nome;


            var infoPack = {
              "nome": this.objDeAlteracoes.editar[inventarioIndex].nome,
              "descricao": this.objDeAlteracoes.editar[inventarioIndex].descricao,
              "img": this.objDeAlteracoes.editar[inventarioIndex].img,
              "id": this.objDeAlteracoes.editar[inventarioIndex].id,
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

        panelService.aplicarMudancas('inventario', mudancaObj);
        var putData = { 'inventario': this.inventarioArray }
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
    this.infoComplementaresSubscription = this.panelService.getInfos('inventario')
      .subscribe((data: any) => {
        this.infosObject = data;
        this.newSubscription = this.personagemService.getPersonagem()
          .subscribe((data: any) => {
            this.personagemService.setPersonagem(data)

            this.inventarioArray = data['inventario'];
            this.panelService.setInfosObj(this.infosObject);
            this.panelService.hoverInfoSend(true);
            this.inventarioArray.forEach((element: any, index: number) => {
              this.inventarioComoObj[index] = {};
              this.inventarioComoObj[index].nome = element;
              this.inventarioComoObj[index].img = "";
              this.inventarioComoObj[index].descricao = "";
              this.inventarioComoObj[index].id;
              this.contadorArray.push(index);
              this.infosObject.forEach((infoSobreInventario: any) => {
                if (infoSobreInventario.nome === element) {
                  infoSobreInventario.img ? this.inventarioComoObj[index].img = infoSobreInventario.img : this.semImagem.push(element);
                  infoSobreInventario.descricao ? this.inventarioComoObj[index].descricao = infoSobreInventario.descricao : this.semDescricao.push(element);
                  this.inventarioComoObj[index].id = infoSobreInventario.id;
                }
              });
            });
            this.loading = false;
          })
      })

  }


  ativarAlteracao(_index: number = -1) {
    this.erroRepeticao = false;
    this.erroVazio = false;

    var inventario: any;
    var index: any;
    var tipo: any;

    if (this.inventarioArray[_index] && this.inventarioComoObj[_index].id) {
      inventario = this.inventarioArray[_index];
      index = this.inventarioComoObj[_index].id;
      tipo = "Editar";
    } else if (this.inventarioArray[_index]) {
      tipo = "None";
      inventario = 'novo';
      index = _index;
    } else {
      tipo = "Novo";
      inventario = 'none';
      index = _index;
    }

    if (this.editBoxState === false && inventario !== 'novo') {

      if (inventario === 'none') {
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
        this.alterarAtual = index;
        this.tipoAtual = 'editar';
        if (!Object.keys(this.objDeAlteracoes['editar']).includes(String(index))) {
          this.objDeAlteracoes['editar'][index] = {
            'tipo': tipo,
            'nome': inventario,
            'img': this.inventarioComoObj[this.objAtual].img,
            'descricao': this.inventarioComoObj[this.objAtual].descricao,
            'id': this.inventarioComoObj[this.objAtual].id
          };
        }
        Object.keys(this.inventarioComoObj[this.objAtual]).forEach((inventarioI: string) => {
          if (this.inventarioComoObj[this.objAtual][inventarioI] !== this.objDeAlteracoes['editar'][index][inventarioI]) {
            this.undoBotao[inventarioI] = true;
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
    var indexInventario = Number(Object.keys(this.inventarioComoObj).find(n => this.inventarioComoObj[n].id === id));
    return indexInventario
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
      Object.keys(this.inventarioComoObj[this.objAtual]).forEach((inventarioI: string) => {
        if (this.inventarioComoObj[this.objAtual][inventarioI] !== this.objDeAlteracoes['editar'][this.alterarAtual][inventarioI]) {
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
      if (this.inventarioComoObj[this.objAtual][tipo] !== this.objDeAlteracoes['editar'][this.alterarAtual][tipo]) {
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

    this.inventarioComoObj[index] = {};
    this.inventarioComoObj[index].nome = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome;
    this.inventarioComoObj[index].img = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].img;
    this.inventarioComoObj[index].descricao = this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].descricao;
    var ultimoInventario: any = Object.keys(this.inventarioComoObj).at(-1);
    var ultimoId: any = this.inventarioComoObj[ultimoInventario];
    this.novosIds[index] = {};
    this.novosIds[index].id = Number(ultimoId) + 1;
    this.contadorArray.push(index);
    this.inventarioArray.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.itensCriados.push(this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome);
    this.novosArray.splice(this.novosArray.indexOf(this.tipoAtual + this.alterarAtual), 1);
    this.limparTudo()
    this.editBoxState = false;
    this.limparUndoBotoes();
    if (this.tabCtrlService.habilitarBotoesGet() !== true) {
      this.tabCtrlService.reqButtonStateSend(true);
    }
  }

  excluir() {
    this.inventarioArray.splice(Number(this.objAtual), 1);
    this.contadorArray = [];
    var novoinventarioObj: any = {};
    this.idsExcluidos.push(this.inventarioComoObj[this.objAtual].id);
    delete this.inventarioComoObj[this.objAtual];
    Object.keys(this.inventarioComoObj).forEach((inventario: any, index: number) => {
      novoinventarioObj[index] = {};
      Object.keys(this.inventarioComoObj[inventario]).forEach(dado => {
        novoinventarioObj[index][dado] = this.inventarioComoObj[inventario][dado];
      });
      this.contadorArray.push(index);
    });

    this.inventarioComoObj = {};
    Object.keys(novoinventarioObj).forEach((inventario: any, index: number) => {
      this.inventarioComoObj[index] = {};
      this.inventarioComoObj[index].nome = novoinventarioObj[index].nome
      this.inventarioComoObj[index].img = novoinventarioObj[index].img
      this.inventarioComoObj[index].descricao = novoinventarioObj[index].descricao
      this.inventarioComoObj[index].id = novoinventarioObj[index].id
    })
    novoinventarioObj = {};

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
    var novoDado = this.inventarioComoObj[this.objAtual][tipoDado];
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
      data: { titulo: titulo, tipo: "do seu inventário" }
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


  mouseIn(inventario: any) {
    if (!this.itensCriados.includes(inventario) && !this.semImagem.includes(inventario) && !this.semDescricao.includes(inventario)) {
      this.panelService.mouseEnteredSend('inventario', inventario)
    } else {
      this.panelService.mouseEnteredSend('inventario', 'invalido')
    }
  }

  checarClasse(index: any) {
    var atributos = ["nome", "descricao", "img"];
    var alteracao: boolean = false;
    if (this.inventarioComoObj[index]) {
      atributos.forEach(atributo => {
        this.mudadosArray.includes('editar' + this.inventarioComoObj[index].id + atributo) ? alteracao = true : ""
      })
    }
    return alteracao;
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
    Object.keys(this.inventarioComoObj).forEach(inventario => {
      if (this.inventarioComoObj[inventario].nome === this.objDeAlteracoes[this.tipoAtual][this.alterarAtual].nome) {
        var indice = this.acharIndex(this.alterarAtual);
        if (Number(inventario) !== indice) {
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
