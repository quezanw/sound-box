import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  socket: SocketIOClient.Socket;

  constructor(private _http: HttpClient) {
    this.socket = io.connect('http://10.0.0.74:8888');
    // this.socket = io.connect('http://localhost:8888');
  }

  login() {
    return this._http.get('/login');
  }

  getSong(name: string, refresh_token: string) {
    return this._http.get('/get_song/' + name + '/' + refresh_token);
  }

  playSong(song: any) {
    return this._http.put('/play_song', song);
  }

  getUser(user: string, refresh_token: string) {
    return this._http.get('/get_user/' + user + '/' + refresh_token);
  }
}
