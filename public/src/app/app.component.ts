import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
