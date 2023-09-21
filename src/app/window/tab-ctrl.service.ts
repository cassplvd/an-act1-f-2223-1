import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabCtrlService {

  mudancaState = new Subject();
  reqButton: boolean = false;
  reqButtonState: boolean = false;
  clearState = new Subject();
  clearMudancas: boolean = false;
  enviarMudancas = new Subject();
  mudancaAtiva = new Subject();
  undo = new Subject();
  botoesOn: boolean = false;
  mudancaOn: boolean = false;

  constructor(private http: HttpClient) {
  }

  // ----------------------------------
  // FUNÇÕES SIMPLES DECLARAR VARIÁVEIS

  habilitarBotoesSet(state: boolean) {
    this.mudancaOn = state;
  }

  habilitarBotoesGet() {
    return this.mudancaOn;
  }

  mostrarBotoesSet(state: boolean) {
    this.botoesOn = state;
  }

  mostrarBotoesGet() {
    return this.botoesOn;
  }



  // ----------------------------------
  // FUNÇÕES DE COMUNICAÇÕES SIMULTÂNEAS


  reqButtonStateSend(state: boolean) {
    this.mudancaOn = state;
    this.mudancaAtiva.next(state);
  }

  reqButtonStateReceive() {
    return this.mudancaAtiva.asObservable();
  }


  enviarMudancasSend(tab: string) {
    this.enviarMudancas.next(tab);
  }

  enviarMudancasReceive() {
    return this.enviarMudancas.asObservable();
  }

  buttonsOnSend() {
    this.botoesOn = true;
    this.mudancaState.next(true);
  }

  buttonsOnReceive() {
    return this.mudancaState.asObservable();
  }

  ClearStateSend() {
    this.mudancaOn = false;
    this.botoesOn = false;
    this.clearState.next(true);
  }

  ClearStateReceive() {
    return this.clearState.asObservable();
  }

  UndoMudancasSend() {
    this.ClearStateSend();
    this.reqButtonStateSend(false);
    this.undo.next(true)
  }

  UndoMudancasReceive() {
    return this.undo.asObservable();
  }

}
