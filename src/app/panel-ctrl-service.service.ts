import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription, delay, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelCtrlService {

  port: string = '5600';
  mouseEntered = new Subject();
  mouseLeft = new Subject();
  hoverInfo = new Subject();
  categoriaSubject = new Subject();
  dadoSubject = new Subject();
  deletadoSubject = new Subject();
  fimDaMudancaSubject = new Subject();
  infosPegasSubject = new Subject();
  localSelecionadoSubject = new Subject();
  categoria: string = '';
  dado: string = '';
  headers = new HttpHeaders();
  infosComplementares: any;
  mudancasSubscription: Subscription = new Subscription;
  temCoisaPraDeletarAinda: boolean = false;
  mudancasPraFazer: any = {
    coisasPraDeletar: [],
    coisasPraAlterar: [],
    coisasPraAdicionar: [],
  };
  tipoDeDadoPraMudar: string = "";
  tempoRolando: boolean = false;
  timer: any;


  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
    this.mudancasSubscription = this.mudancaReceive()
      .subscribe(() => {
        if (this.mudancasPraFazer.coisasPraAlterar.length > 0) {
          this.patchInfos(this.tipoDeDadoPraMudar, this.mudancasPraFazer.coisasPraAlterar[0].id, this.mudancasPraFazer.coisasPraAlterar[0]);
        } else if (this.mudancasPraFazer.coisasPraDeletar.length > 0) {
          this.deleteInfos(this.tipoDeDadoPraMudar, this.mudancasPraFazer.coisasPraDeletar[0].id);
        } else if (this.mudancasPraFazer.coisasPraAdicionar.length > 0) {
          this.postInfos(this.tipoDeDadoPraMudar, this.mudancasPraFazer.coisasPraAdicionar[0]);
        } else {
          this.fimMudancaSend();
        }
      })
  }

  mudancaLocalSelecionadoSend(id: any) {
    this.localSelecionadoSubject.next(id);
  }

  mudancaLocalSelecionadoReceive() {
    return this.localSelecionadoSubject.asObservable();

  }

  getInfosObj() {
    return this.infosComplementares
  }

  setInfosObj(obj: any) {
    this.infosComplementares = obj;
    this.infosPegasSubject.next(true);
  }

  infosPegasReceive() {
    return this.infosPegasSubject.asObservable();
  }

  mouseDadoGet() {
    return [this.categoria, this.dado];
  }

  mouseEnteredSend(_categoria: string, _dado: string) {
    if (this.tempoRolando === true) {
      clearTimeout(this.timer)
    }
    this.tempoRolando = true;
    this.timer = setTimeout(() => {
      this.sendCategoria(_categoria);
      this.sendDado(_dado);
      this.mouseEntered.next(true);
      this.tempoRolando = false;
    }, 300)
  }

  mouseEnteredReceive() {
    return this.mouseEntered.asObservable();
  }

  mouseLeftSend() {
    this.mouseLeft.next(true);
  }

  mouseLeftReceive() {
    return this.mouseLeft.asObservable();
  }

  hoverInfoSend(interruptor: boolean) {
    this.hoverInfo.next(interruptor);
  }

  hoverInfoReceive() {
    return this.hoverInfo.asObservable();
  }

  sendCategoria(_categoria: any) {
    this.categoriaSubject.next(_categoria);
  }

  receiveCategoria() {
    return this.categoriaSubject.asObservable();
  }

  sendDado(_dado: any) {
    this.dadoSubject.next(_dado);
  }

  receiveDado() {
    return this.dadoSubject.asObservable();
  }

  getInfos(tipoDado: string) {
    return this.http.get(`http://localhost:${this.port}/${tipoDado}`)
      .pipe(take(1), delay(80))
  }

  postInfos(tipoDado: string, data: any) {
    return this.http.post(`http://localhost:${this.port}/${tipoDado}`, data, { headers: this.headers })
      .pipe(take(1), delay(200))
      .subscribe(res => {
        this.mudancasPraFazer.coisasPraAdicionar.splice(0, 1)
        this.mudancaSend()
      })
  }

  patchInfos(tipoDado: string, id: any, data: any) {
    console.log(tipoDado);
    console.log(id);
    console.log(data);

    return this.http.patch(`http://localhost:${this.port}/${tipoDado}/${id}`, data, { headers: this.headers })
      .pipe(take(1), delay(200))
      .subscribe(res => {
        this.mudancasPraFazer.coisasPraAlterar.splice(0, 1)
        this.mudancaSend()
      })

  }

  aplicarMudancas(tipo: any, data: any) {
    console.log(data);

    this.tipoDeDadoPraMudar = tipo;
    this.mudancasPraFazer.coisasPraAlterar = data.praAlterar;
    this.mudancasPraFazer.coisasPraDeletar = data.praDeletar;
    this.mudancasPraFazer.coisasPraAdicionar = data.praAdicionar;
    this.mudancaSend();
  }


  deleteInfos(tipoDado: string, id: any) {
    this.http.delete(`http://localhost:${this.port}/${tipoDado}/${id}`)
      .pipe(take(1), delay(200))
      .subscribe(() => {
        this.mudancasPraFazer.coisasPraDeletar.splice(0, 1);
        this.mudancaSend();
      })

  }

  mudancaSend() {
    this.deletadoSubject.next(true);
  }

  mudancaReceive() {
    return this.deletadoSubject.asObservable();
  }

  fimMudancaSend() {
    this.fimDaMudancaSubject.next(true);
  }

  fimMudancaReceive() {
    return this.fimDaMudancaSubject.asObservable();
  }

}
