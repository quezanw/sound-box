import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  refresh_token: any;
  socket: SocketIOClient.Socket;

  constructor(private _http: HttpClient) {
    this.socket = io.connect('http://192.168.1.180:8888');
  }

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

  playSong(song: any) {
    return this._http.put('/play_song', song);
  }

  createRoom(room: any) {
      return this._http.post('/create_room', room);
  }

  getAllRooms() {
      return this._http.get('/get_rooms');
  }

  getRoomById(id) {
      return this._http.get('/get_room/' + id);
  }
}
