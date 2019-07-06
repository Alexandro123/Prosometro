import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Componente } from '../../interfaces/interfaces';
import { MenuService } from 'src/app/services/menu.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  menu: Observable<Componente[]>;
  constructor(private menuService: MenuService,
    private menuController: MenuController) { }

  ngOnInit() {
    this.menu = this.menuService.getMenu();
  }



  componentes: Componente[] = [];

  //constructor() {}



  toggleMenu(){
    this.menuController.toggle();
  }

}
