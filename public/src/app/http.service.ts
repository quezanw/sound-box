import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  login() {
    return this._http.get('/login', {withCredentials: true});
  }

  getSong(name) {
    return this._http.get('/get_song/' + name, {withCredentials: true});
  }
}
