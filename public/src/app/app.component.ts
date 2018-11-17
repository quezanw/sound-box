import { Component } from '@angular/core';
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
}
