import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonagemService } from '../personagem.service';
import { Subscription } from 'rxjs';
import { TabCtrlService } from '../window/tab-ctrl.service';

@Component({
  selector: 'app-panel-left',
  templateUrl: './panel-left.component.html',
  styleUrls: ['./panel-left.component.scss']
})
export class PanelLeftComponent implements OnInit, OnDestroy {
  newSubscription: Subscription = new Subscription;
  updateSubscription: Subscription = new Subscription;
  nome: string = '';
  titulo: string = '';
  infosBarraNome: any = ['Vida', 'Fome', 'Sede', 'Energia'];
  infosBarraValor: any = [];
  nivel: string = '';
  dinheiroFormatado: string = '';
  dinheiroFull: string = '';
  pontos: string = '';
  experiencia: string = '';
  energia: string = '';
  motivacao: string = '';
  sanidade: string = '';
  sanidadeCor: string = '';


  constructor(
    private personagemService: PersonagemService,
    private tabCtrlService: TabCtrlService,
  ) {

    this.updateSubscription = tabCtrlService.UndoMudancasReceive()
      .subscribe(() => {
        this.iniciar();
      })
  }

  ngOnInit(): void {
    this.iniciar()
  }

  ngOnDestroy(): void {
    this.newSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }


  iniciar() {
    this.newSubscription = this.personagemService.getPersonagem()
      .subscribe((data: any) => {
        this.personagemService.setPersonagem(data)
        this.pontos = data.informacoesPersonagem.totalPontos;
        var cor = 'mid';
        if (data.informacoesPersonagem.sanidade < 45) {
          cor = 'low';
        } else if (data.informacoesPersonagem.sanidade >= 65) {
          cor = 'high';
        }
        this.sanidadeCor = cor;
        this.sanidade = data.informacoesPersonagem.sanidade;
        this.experiencia = data.experiencia;
        this.nome = data.nome;
        this.titulo = data.titulo;
        this.infosBarraValor[0] = data.informacoesPersonagem.vida;
        this.infosBarraValor[1] = 100 - data.saciedade;
        this.infosBarraValor[2] = 100 - data.hidratacao;
        this.infosBarraValor[3] = data.informacoesPersonagem.energia;
        this.nivel = data.nivel;
        let formatador = Intl.NumberFormat('en', { notation: 'compact' });
        let reais = Intl.NumberFormat('pt-BR', { currency: 'BRL' });
        var dindin = reais.format(data.dinheiro);
        if (data.dinheiro > 999.99) {
          dindin = formatador.format(data.dinheiro);
        }
        this.dinheiroFormatado = dindin;
        this.dinheiroFull = reais.format(data.dinheiro);
      })
  }

}
