import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router } from '@angular/router';
// import { abreFecha } from './animations';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // abreFecha
  ]
})
export class AppComponent implements OnInit {

  botaoInit: boolean = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: any) => (event instanceof NavigationEnd)))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects !== '/') {
          this.botaoInit = false;
        }
      });
  }


  ngOnInit(): void {
  }

  start() {
    this.router.navigate(['home'])
  }

}
