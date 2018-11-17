import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  refresh_token: any;

  constructor(private _http: HttpClient) { }

  login() {
    return this._http.get('/login');
  }

  getSong(name: string, refresh_token: string) {
    return this._http.get('/get_song/' + name + '/' + refresh_token);
  }

  setRefreshToken(data: string) {
    this.refresh_token = data;
  }

  getRefreshToken() {
    return this.refresh_token;
  }
}
