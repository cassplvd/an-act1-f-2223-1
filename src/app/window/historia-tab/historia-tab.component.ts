import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { PersonagemService } from 'src/app/personagem.service';
import { TabCtrlService } from '../tab-ctrl.service';
import { onOff } from '../transitions';

@Component({
  selector: 'app-historia-tab',
  templateUrl: './historia-tab.component.html',
  styleUrls: ['./historia-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    onOff
  ]
})
export class HistoriaTabComponent implements OnInit {

  newSubscription: Subscription = new Subscription;
  enviarMudancasSubscription: Subscription = new Subscription;
  clearSubscription: Subscription = new Subscription;
  putSubscription: Subscription = new Subscription;
  personagem: any;
  historia: any = "";
  historiaInicio: any = "";
  historiaUpdt: any = {};
  loading: boolean = true;
  @ViewChild('texto') div!: ElementRef;


  constructor(private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService) {

    this.clearSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.loading = true;
        if (this.historiaUpdt !== undefined || this.historiaUpdt !== null) {
          delete this.historiaUpdt.historia;
        }
        this.div.nativeElement.innerHTML = "";
        this.iniciar();
      })


    this.enviarMudancasSubscription = tabCtrlService.enviarMudancasReceive()
      .subscribe((data) => {
        this.loading = true;
        if (data !== "hist") {
          return;
        }
        this.historiaUpdt.historia = this.historia;
        personagemService.putPersonagem(this.historiaUpdt);
        this.putSubscription = personagemService.getPutResposta()
          .pipe(take(1))
          .subscribe(() => {
            this.tabCtrlService.UndoMudancasSend();

          })

      })
  }

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.tabCtrlService.reqButtonStateSend(false);
    this.newSubscription.unsubscribe();
    this.clearSubscription.unsubscribe();
    this.enviarMudancasSubscription.unsubscribe();
    this.putSubscription.unsubscribe();
    this.personagemService.limparPersonagem();
  }


  iniciar() {
    this.newSubscription = this.personagemService.getPersonagem()
      .subscribe((data: any) => {
        this.personagemService.setPersonagem(data)

        this.historia = data.historia;
        this.historiaInicio = this.historia;

        this.loading = false;

      })
  }

  // pegar da database o texto - OK
  // checar se mudou - OK
  // oferecer opções de salvar mudanças ou desfazer-las
  // oferecer opção de salvar ou sair quando apertar o botao de fechar ou quando mudar de aba


  mudouSeAlgo() {
    if (this.historiaInicio !== this.historia) {
      this.tabCtrlService.reqButtonStateSend(true);
    } else {
      this.tabCtrlService.reqButtonStateSend(false);
    }
  }

  ativarBotoes() {
    if (this.tabCtrlService.mostrarBotoesGet() !== true) {
      this.tabCtrlService.buttonsOnSend();
    }
  }

  atualizarTexto() {
    if (this.historiaInicio === this.historia) {
      this.tabCtrlService.ClearStateSend();
    } else {
    }
  }

}
