import { state, trigger, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
// import { abreFecha } from '../animations';
import { WindowCtrlService } from '../window-ctrl.service';
import { DialogAnimationsExampleDialog } from './change-dialog/change-dialog.component';
import { TabCtrlService } from './tab-ctrl.service';
import { PanelCtrlService } from '../panel-ctrl-service.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  host: {
    'style': 'position: absolute;width: 64%;height: calc(100vh - 32px);'
  },
  animations: [
    trigger('viewOn', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(50%) scaleY(0)'
      })),
      transition('void => *', animate('120ms ease'))
    ]),
    trigger('fechaWindow', [
      // transition(':enter', [
      //   style({
      //     opacity: 0,
      //     transform: 'translateY(45%) scaleY(0.1)'
      //   }),
      //   animate('120ms ease', style({
      //     opacity: 1,
      //     transform: 'translateY(0) scaleY(1)'
      //   })),
      // ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0) scaleY(1)'
        }),
        animate('1200ms ease', style({
          opacity: 0,
          transform: 'translateY(50%) scaleY(0)'
        }))
      ])
    ]),
  ]
})
export class WindowComponent implements OnInit, OnDestroy {

  windowMostrar: boolean = false;
  rotaAtual: string = "";
  @Output() windowMudou = new EventEmitter<boolean>();
  tabAtiva: string = '';
  tabsNomesAct: Array<string> = [];
  tabsNomes: Array<string> = [];
  tabsUrl: Array<string> = [];
  tabs: any;
  botoesMudancaSubscrition: Subscription = new Subscription();
  clearMudancaSubscrition: Subscription = new Subscription();
  botoesAtivosSubscrition: Subscription = new Subscription();
  botoesMudanca: boolean = false;
  reqButtonAtivoSet: boolean = false;

  constructor(private windowService: WindowCtrlService,
    private tabCtrlService: TabCtrlService,
    private router: Router,
    public dialog: MatDialog,
    private panelService: PanelCtrlService
  ) {

    this.botoesMudancaSubscrition = tabCtrlService.buttonsOnReceive()
      .subscribe(() => this.botoesMudanca = true)

    this.clearMudancaSubscrition = tabCtrlService.ClearStateReceive()
      .subscribe(() => {
        this.reqButtonAtivoSet = false;
        this.botoesMudanca = false;
      })

    this.botoesAtivosSubscrition = tabCtrlService.reqButtonStateReceive()
      .subscribe(data => this.reqButtonAtivoSet = Boolean(data))

    var tabAtual = router.url.replace("/w/", "");
    this.tabAtiva = this.windowService.getTab(tabAtual);
  }

  ngOnInit(): void {

    this.tabs = this.windowService.tabs;
    this.tabsNomes = Object.keys(this.tabs);

    Object.keys(this.tabs).forEach((element: any) => {
      this.tabsUrl.push(element.url);
      this.tabsNomesAct.push(element.nome);
    })

    this.panelService.sendCategoria(this.tabAtiva);
    this.panelService.hoverInfoSend(true);

  }

  ngOnDestroy(): void {
    this.panelService.hoverInfoSend(false);
    this.botoesMudancaSubscrition.unsubscribe();
    this.botoesAtivosSubscrition.unsubscribe();
    this.clearMudancaSubscrition.unsubscribe();
  }


  fecharWindow() {
    if (this.reqButtonAtivoSet !== false) {

      const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
        width: '350px',
        height: '350px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        } else if (result === "ok") {
          this.clearMudancas();
          this.windowMudou.emit(true);
          this.windowService.setTabSelecionada(this.tabs[this.tabAtiva].url, this.tabAtiva);
          this.router.navigate(['']);
        }
      });
    } else {
      this.windowMudou.emit(true);
      this.windowService.setTabSelecionada(this.tabs[this.tabAtiva].url, this.tabAtiva);
      this.router.navigate(['']);
    }
  }


  mudarAba(pagina: any) {
    if (this.tabAtiva !== pagina) {
      // this.tabAtiva = pagina;


      if (this.reqButtonAtivoSet !== false) {

        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
          width: '350px',
          height: '350px'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (!result) {
            return;
          } else if (result === "ok") {
            this.clearMudancas();
            this.windowService.setTabSelecionada(this.tabs[pagina].url, pagina);
            this.router.navigate(['w', this.windowService.getTabUrl(pagina)]);
            this.tabAtiva = pagina;
          }
        });
      } else {
        this.windowService.setTabSelecionada(this.tabs[pagina].url, pagina);
        this.router.navigate(['w', this.windowService.getTabUrl(pagina)]);
        this.tabAtiva = pagina;
      }

    }
  }

  clearMudancas() {
    this.tabCtrlService.UndoMudancasSend();
    // }
  }

  enviarMudancas() {
    var url = this.router.url.replace("/w/", "")
    this.tabCtrlService.enviarMudancasSend(url);
  }

}
