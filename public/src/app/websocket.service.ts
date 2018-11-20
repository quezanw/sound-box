import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket; //socket that connects to our socket.io server

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io();

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      try {
        this.socket.on('room message', data => {
          console.log("Room has received message from server");
          observer.next(data);
        });
      } catch (e) {
        console.log("Error receiving info from websocket server for room message");
        console.log(e);
      }
      try {
        this.socket.on('song_queue', data => {
          console.log("Adding song from the server");
          observer.next(data);
        });
      } catch (e) {
        console.log("Error receiving info from websocket server for song to queue");
        console.log(e); 
      }
      return () => {
        try {
          this.socket.disconnect();
        } catch (e) {
          console.log("error in disconnect in websocket server");
          console.log(e);
        }
      }
    })

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (data: Object) => {
        console.log("trying to emit data")
        try {
          this.socket.emit(data['emit'], data['message']);
        } catch (e) {
          console.log("Error in websocket service:", data['emit']);
          console.log(e);
        }
      },
    };

    return Rx.Subject.create(observer, observable);
  }
}
