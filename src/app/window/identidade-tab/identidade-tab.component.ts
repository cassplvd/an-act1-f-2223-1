import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PersonagemService } from 'src/app/personagem.service';
import { TabCtrlService } from '../tab-ctrl.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { onOff } from '../transitions';

@Component({
  selector: 'app-identidade-tab',
  templateUrl: './identidade-tab.component.html',
  styleUrls: ['./identidade-tab.component.scss'],
  animations: [
    onOff
  ]
})
export class IdentidadeTabComponent implements OnInit, OnDestroy {

  newSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;

  identidade: any = {
    "id": {
      "nomes": ["Nome", "Título", "Idade", "Nacionalidade"],
      "nome": "",
      "titulo": "",
      "idade": 0,
      "nacionalidade": "",
    },
    "pontuacao": {
      "nomes": ["Pontos", "Nível", "Experiência"],
      "totalPontos": 0,
      "nivel": 0,
      "experiencia": 0,
    },
    "psicologico": {
      "nomes": ["Personalidade", "Moralidade", "Hábito", "Vício"],
      "personalidade": "",
      "moralidade": "",
      "habito": "",
      "vicio": "",
    },
    "visual": {
      "aparencia": ""
    }
  };
  identidadeInicio: any = {
    "id": {
      "nomes": ["Nome", "Título", "Idade", "Nacionalidade"],
      "nome": "",
      "titulo": "",
      "idade": 0,
      "nacionalidade": "",
    },
    "pontuacao": {
      "nomes": ["Pontos", "Nível", "Experiência"],
      "totalPontos": 0,
      "nivel": 0,
      "experiencia": 0,
    },
    "psicologico": {
      "nomes": ["Personalidade", "Moralidade", "Hábito", "Vício"],
      "personalidade": "",
      "moralidade": "",
      "habito": "",
      "vicio": "",
    },
    "visual": {
      "aparencia": ""
    }
  };
  putDataIdentidade: any = {
    "nome": "",
    "titulo": "",
    "idade": 0,
    "nacionalidade": "",
    "personalidade": "",
    "moralidade": "",
    "habito": "",
    "vicio": "",
    "aparencia": "",
    "totalPontos": 0,
    "nivel": 0,
    "experiencia": 0
  };
  identDataArray: any = ["nome", "titulo", "idade", "nacionalidade"];
  pontuacaoDataArray: any = ["totalPontos", "nivel", "experiencia"];
  psiDataArray: any = ["personalidade", "moralidade", "habito", "vicio"];
  loading: boolean = false;
  arrayValoresMudados: any = [];
  numeraisArray: any = ["totalPontos", "nivel", "experiencia",];
  fonteNumerosArray: any = ["idade", "totalPontos", "nivel", "experiencia"];


  constructor(private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService,
  ) {


    this.clearSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.loading = false;
        this.arrayValoresMudados = [];
        this.pegarInfoPersonagem()
      })


    this.enviarMudancasSubscription = tabCtrlService.enviarMudancasReceive()
      .subscribe((data) => {
        this.loading = true;
        if (data !== "ide") {
          return;
        }
        // Object.keys(this.putDataIdentidade).forEach(param => {
        Object.keys(this.identidade).forEach(tipo => {
          Object.keys(this.identidade[tipo]).forEach(atributos => {
            if (atributos !== "nomes") {
              if (this.numeraisArray.includes(atributos) && typeof this.identidade[tipo][atributos] !== 'number') {
                var valor = this.identidade[tipo][atributos];
                var valor = valor.replace(/\D+/g, '')
                this.putDataIdentidade[atributos] = Number(valor);
              } else {
                this.putDataIdentidade[atributos] = this.identidade[tipo][atributos];
              }
            }
          })
        })
        // });
        personagemService.putPersonagem(this.putDataIdentidade);
        this.putSubscription = personagemService.getPutResposta()
          .pipe(take(1))
          .subscribe(() => {
            this.tabCtrlService.UndoMudancasSend();

          })

      })
  }


  ngOnInit(): void {
    this.pegarInfoPersonagem();
    this.loading = true;
  }

  ngOnDestroy(): void {
    this.newSubscription.unsubscribe();
    this.clearSubscription.unsubscribe();
    this.enviarMudancasSubscription.unsubscribe();
    this.putSubscription.unsubscribe();
    this.personagemService.limparPersonagem();
  }

  pegarInfoPersonagem() {
    this.newSubscription = this.personagemService.getPersonagem()
      .subscribe((data: any) => {

        this.personagemService.setPersonagem(data)

        Object.keys(this.identidadeInicio).forEach((tipoDeInfo) => {
          Object.keys(this.identidadeInicio[tipoDeInfo]).forEach((param) => {
            if (param !== "nomes") {
              if (!data[param]) {
                Object.keys(data).forEach(paramPai => {
                  if (data[paramPai] !== null) {
                    if (typeof data[paramPai] === 'object' && data[paramPai][param]) {
                      this.identidadeInicio[tipoDeInfo][param] = data[paramPai][param];
                    }
                  }
                })
              } else {
                if (data[param] !== null) {
                  this.identidadeInicio[tipoDeInfo][param] = data[param];
                }
              }
            }
          })
        })
        this.identidade = JSON.parse(JSON.stringify(this.identidadeInicio));


        this.loading = false;
      })
  }


  mudouSeAlgo(categoria: any, parametro: any, evento: any) {

    if (this.identidadeInicio[categoria][parametro] === evento) {
      if (this.arrayValoresMudados.includes(parametro)) {
        this.arrayValoresMudados.splice(this.arrayValoresMudados.indexOf(parametro), 1);
      }
      if (this.arrayValoresMudados.length < 1) {
        this.tabCtrlService.reqButtonStateSend(false);
      }
    } else {
      if (!this.arrayValoresMudados.includes(parametro)) {
        this.arrayValoresMudados.push(parametro);
      }
      this.tabCtrlService.reqButtonStateSend(true);
    }

  }

  ativarBotoes() {
    if (this.tabCtrlService.mostrarBotoesGet() !== true) {
      this.tabCtrlService.buttonsOnSend();
    }
  }

  atualizarTexto() {
    if (this.tabCtrlService.mostrarBotoesGet() === true && this.tabCtrlService.habilitarBotoesGet() === false) {
      this.tabCtrlService.ClearStateSend();
    }
  }

}
