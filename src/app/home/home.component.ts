import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PersonagemService } from '../personagem.service';
// import { abreFecha } from '../animations';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('viewOn', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(50%) scaleY(0)'
      })),
      transition('void => *', animate('120ms ease'))
    ]),
    trigger('fechaWindow', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(45%) scaleY(0.1)'
        }),
        animate('120ms ease', style({
          opacity: 1,
          transform: 'translateY(0) scaleY(1)'
        })),
      ]),
      transition(':leave', [
        animate('120ms ease', style({
          opacity: 0,
          transform: 'translateY(50%) scaleY(0)'
        }))
      ])
    ]),
    // abreFecha
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  newSubscription: Subscription = new Subscription;
  title = 'rpgzao';
  infos$: any;
  bottom: boolean = true;
  currentRoute: any;
  tabAtual!: string;

  constructor(
    private personagemService: PersonagemService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event: any) => (event instanceof NavigationEnd)))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects !== '/') {
          this.bottom = false;
        } else {
          this.bottom = true;
        }
      });
  }



  ngOnInit(): void {
    // this.bottom = true;
  }

  ngOnDestroy(): void {
    this.newSubscription.unsubscribe();
  }

}
