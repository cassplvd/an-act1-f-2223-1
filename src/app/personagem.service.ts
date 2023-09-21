import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Subject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {


  port: string = "5500";
  personagemId: string = "636fb1ff72fcb30fbd905de6";
  personagem: any = {};
  habilidades: object = {};
  putResposta = new Subject();
  personagemPego = new Subject();


  constructor(private http: HttpClient) { }


  getPutResposta() {
    return this.putResposta.asObservable();
  }

  setPersonagem(data: any) {
    this.personagem = data;

  }

  getPersonagem() {
    return this.http.get(`http://localhost:${this.port}/personagens/${this.personagemId}`)
      .pipe(take(1), delay(100))
  }

  personagemPegoReceive() {
    return this.personagemPego.asObservable();
  }

  putPersonagem(data: any) {

    var id = this.personagem.id;
    console.log(data);

    Object.keys(data).forEach(atributo => {
      if (Object.keys(this.personagem).includes(atributo)) {
        this.personagem[atributo] = data[atributo];
      } else {
        Object.keys(this.personagem).forEach(atributoPai => {
          if (this.personagem[atributoPai] !== null && typeof this.personagem[atributoPai] === "object") {
            this.personagem[atributoPai][atributo] = data[atributo];
          }
        })
      }
    })

    this.http.put(`http://localhost:${this.port}/personagens/${id}`, this.personagem)
      .pipe(take(1))
      .subscribe(res => {
        this.putResposta.next('ok');
      })

  }

  limparPersonagem() {
    if (Object.keys(this.personagem).length > 0) {
      Object.keys(this.personagem).forEach(param => {
        delete this.personagem[param];
      })
    }

  }


}
