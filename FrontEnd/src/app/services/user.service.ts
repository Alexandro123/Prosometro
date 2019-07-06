import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../models/user.model';
import { GLOBAL } from './global.service';

@Injectable()
export class UserService {
  public url : String;
  public identity;
  public token;

  constructor(public _http : HttpClient) { //modulos que trabaja el metodo HTTP de angular
    this.url = GLOBAL.url;
  }

  registro(user : User) : Observable<any>{ //lista
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'registrar', params, {headers : headers});
  }

  getUsers() : Observable<any>{ //lista
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(this.url + 'usuarios', {headers : headers});
  }

  login(user, gettoken = null): Observable<any>{
    if(gettoken != null){
      user.gettoken = gettoken;
    }

    let params = JSON.stringify(user); //Lo pasa a un JSON string
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', params, {headers : headers});
  }

  //trae los datos del usuario logueado del sessionStorage
  getIdentity(){
    var identity2 = JSON.parse(sessionStorage.getItem('identity')) //cambia cualquier formato a JSON
    if(identity2 != 'undefined'){
      this.identity = identity2;
    }else{
      this.identity = null;
    }

    return this.identity;
  }
  
  //trae el token del sessionStorage
  getToken(){
    var token2 = sessionStorage.getItem('token')
    if(token2 != 'undefined'){
      this.token = token2;
    }else{
      this.token = null;
    }

    return this.token;
  }

  updateUser(user:User): Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization',this.getToken());

    return this._http.put(this.url + 'editar-usuario/'+user._id, params, {headers : headers})
  }


}

//Agregar contactos
