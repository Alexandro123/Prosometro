import { Injectable } from '@angular/core';
import { GLOBAL } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Componente } from '../interfaces/interfaces';
 
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  

  constructor(public _http : HttpClient) { 
    
  }

  getMenu(){
      return this._http.get<Componente[]>('/assets/dataMenu/menu.json');
  }

}
