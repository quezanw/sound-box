import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  refresh_token: string;
  userID: string;
  show_form: boolean;
  rooms: any;
  room_info: any;
  new_room: any;
  members: Number;
  errors: any;
  socket: SocketIOClient.Socket;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.socket = this._httpService.socket;
  }

  ngOnInit() {
    this.room_info = {name: "Room Name", members: 0};
    this.errors = [];
    this.show_form = false;
    this.new_room = {};
    this.members = 0;
    this._route.params.subscribe((params: Params) => {
      this.refresh_token = params['refresh_token'];
      this.new_room['host_token'] = this.refresh_token;
      this.userID = params['user_id'];
    })
    this.socket.on('show_rooms', rooms => {
      this.rooms = rooms;
      console.log(this.rooms);
    });
  }

  joinRoom(room_name: string) {
    console.log("User is joining room...")
    let observable = this._httpService.getUser(this.userID, this.refresh_token);
    observable.subscribe(data => {
      this.socket.emit('join', {room_name: room_name, user: data['body']['body']});
      this._router.navigate(['/room/' + room_name]);
    })
  }

  createRoom() {
    this.socket.emit('add_room', {
      name: this.new_room.name, 
      members: [],
      queue: [],
      current_song: null,
      host_refresh_token: this.refresh_token
    });
    this.show_form = !this.show_form;
  }

  getRoom(name: string) {
    for (let room of this.rooms) {
      if (room.name == name) {
        this.room_info = room
      }
    }
  }
}
