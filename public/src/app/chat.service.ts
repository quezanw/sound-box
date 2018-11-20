import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) { 
    this.messages = <Subject<any>>wsService // messages is an observable
      .connect()
      .pipe(map((response: any): any => {
        console.log("Chat service has received response")
        return response;
      }))
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  joinRoom(room: any) {
    console.log("Message is being sent to the service...")
    this.messages.next({emit: 'join', message: room});
  }

  addSong(song: any, room: string) {
    console.log("Song is being sent to the service");
    this.messages.next({emit: 'add_song', message: {song: song, room: room}});
  }
}
