import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChatService } from '../chat.service';

// import anime from 'animejs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  refresh_token: string;
  show_form: boolean;
  rooms: any;
  room_info: any;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private chat: ChatService
  ) { }

  ngOnInit() {
    this.room_info = { name: "Room Name", members: 0};
    this.rooms = [];
    this.show_form = false;
    this._route.params.subscribe((params: Params) => {
      this.refresh_token = params['refresh_token'];
      this._httpService.setRefreshToken(this.refresh_token);
      console.log(this._httpService.refresh_token)
      // this._router.navigate(['/room'])
    })
    this.chat.messages.subscribe(msg => {
      console.log("Response from chat service: " + msg);
    })
  }

  joinRoom(room: string) {
    console.log("User is joining room...")
    this.chat.joinRoom(room);
  }

  showCreateRoom() {
    this.show_form = true;
  }


  getAllRooms() {
    console.log("getting rooms");
  }

  getRoom(id) {
    console.log(id);
    this.room_info.name = 'Terrys Room';
    this.room_info.members = 10;
  }
}
