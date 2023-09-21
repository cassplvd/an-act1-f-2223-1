import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, fromEvent, takeWhile } from 'rxjs';
import { PanelCtrlService } from '../panel-ctrl-service.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  host: { 'style': 'overflow:hidden;' }
})
export class MapaComponent implements OnInit, OnDestroy {

  infosComplementaresSubscription: Subscription = new Subscription;
  scale = 100;
  top = 0;
  left = 0;
  topAnteriores = 0;
  leftAnteriores = 0;
  offsetX = 0;
  offsetY = 0;
  topPoint = 0;
  leftPoint = 0;
  contadorIn: number = 0;
  contadorOut: number = 0;
  locaisExistentes: any = {
    0: {
      "id": "",
      "coordenadas": [0, 0],
      "atual": false
    }
  };
  localAtualTop: number = 33;
  localAtualLeft: number = 33;
  outrosLocais: any = [];
  scrollToLeft: number = 0;
  transitionValor: number = 0;
  zoomed: boolean = false;

  @ViewChild("image", { static: false }) image!: ElementRef<HTMLImageElement>;
  @ViewChild("figura", { static: false }) figura!: ElementRef;

  // @ViewChild('scrollable', { static: false }) scrollable: NgScrollbar;

  pan: {
    active: boolean;
    originX: number;
    originScrollX: number;
    originY: number;
    originScrollY: number;
  } = {
      active: false,
      originX: 0,
      originScrollX: 0,
      originY: 0,
      originScrollY: 0
    }




  constructor(private panelService: PanelCtrlService) {
    this.infosComplementaresSubscription = panelService.infosPegasReceive()
      .subscribe(() => {
        var infos = this.panelService.getInfosObj()
        var locais = infos.local;
        locais.forEach((local: any) => {
          this.locaisExistentes[local.id] = {};
          this.locaisExistentes[local.id].id = local.id;
          this.locaisExistentes[local.id].coordenadas = local.coordenadas;
          this.locaisExistentes[local.id].atual = local.atual;
          this.outrosLocais = Object.keys(this.locaisExistentes);
        });
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.infosComplementaresSubscription.unsubscribe();
  }



  @HostListener('wheel', ['$event']) onMouseWheel(ev: WheelEvent) {
    if (ev.target !== this.image.nativeElement) {
      return;
    }
    if (this.scale > 400 && ev.deltaY < 0) {
      return;
    }
    if (this.scale <= 100 && ev.deltaY > 0) {
      return;
    }

    if (ev.deltaY < 0) {
      this.left = ev.offsetX;
      this.top = ev.offsetY;
    }



    if (this.scale <= 100) {
      this.transitionValor = 0;
      this.zoomed = false;
    } else {
      this.zoomed = true;
      this.transitionValor = 150;

    }

    const newScale = this.scale - ev.deltaY * 0.2;
    this.scale = Math.max(newScale, 100);

    if (this.scale <= 100) {
      this.zoomed = false;
    } else {
      this.zoomed = true;
    }
  }



  public onMouseDown($event: MouseEvent) {
    if (this.zoomed !== true) {
      $event.preventDefault();
      return;
    }
    this.pan.active = true;
    this.pan.originX = $event.x;
    this.pan.originY = $event.y;
    this.pan.originScrollX = this.left;
    this.pan.originScrollY = this.top;


    fromEvent(document, 'mousemove')
      .pipe(
        takeWhile(() => this.pan.active),
        // takeUntil(this.onDestroy$)
      )
      .subscribe(e => {

        this.onMouseMove(e as MouseEvent);
      });

    fromEvent(document, 'mouseup')
      .pipe(
        takeWhile(() => this.pan.active),
        //   takeUntil(this.onDestroy$)
      )
      .subscribe(e => {

        this.cancelPan();
      });

    $event.preventDefault();
  }

  public onMouseMove($event: MouseEvent) {
    if (!this.pan.active) return;

    this.transitionValor = 0;

    const deltaX = $event.x - this.pan.originX;
    const deltaY = $event.y - this.pan.originY;

    this.left = this.pan.originScrollX - deltaX / ((this.scale / 100) - 1);
    this.top = this.pan.originScrollY - deltaY / ((this.scale / 100) - 1);

    this.figura.nativeElement.style.cursor = 'grab';
  }

  cancelPan() {
    this.pan.active = false;
    this.pan.originX = 0;
    this.pan.originScrollX = 0;
    this.pan.originY = 0;
    this.pan.originScrollY = 0;
    this.figura.nativeElement.style.cursor = 'crosshair';

  }

  selecionaLocal(id: any) {
    this.panelService.mudancaLocalSelecionadoSend(id);
  }

}

