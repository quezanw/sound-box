import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { HttpService } from './http.service';
import { RoomComponent } from './room/room.component';
import { RoomsComponent } from './rooms/rooms.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [HttpService],
  // directives: [RoomComponent, RoomsComponent]
})
export class AppComponent {
  title = 'public';

  constructor(private chat: ChatService) {

  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log("Response from chat service: " + msg);
    })
  }

  sendMessage() {
    console.log("User is sending message...")
    this.chat.sendMessage("Test Message")
  }
}
