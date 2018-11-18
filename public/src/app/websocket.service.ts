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
    this.socket = io(environment.ws_url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('message', data => {
        console.log("Received a message from websocket server");
        observer.next(data);
      });
      this.socket.on('room message', data => {
        console.log("Room has received message from server");
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
      next: (data: Object) => {
        console.log("This is the observer's data: " + JSON.stringify(data))
        this.socket.emit(data['emit'], JSON.stringify(data['message']));
      },
    };

    return Rx.Subject.create(observer, observable);
  }
}
