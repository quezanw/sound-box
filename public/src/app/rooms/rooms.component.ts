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
    this.room_info = { name: "Room Name", members: 0};
    this.errors = [];
    this.show_form = false;
    this.new_room = {};
    this.members = 0;
    this._route.params.subscribe((params: Params) => {
      this.refresh_token = params['refresh_token'];
      this._httpService.setRefreshToken(this.refresh_token);
      console.log(this._httpService.refresh_token);
      this.new_room['host_token'] = this.refresh_token;
    })
    this.socket.on('show_rooms', rooms => {
      this.rooms = [];      
      for (let room in rooms) {
        this.rooms.push(room);
      }
    });
  }

  joinRoom(room: string) {
    console.log("User is joining room...")
    this.socket.emit('join', room);
    this._router.navigate(['/room/' + room]);
    this.socket.on('room message', data => {
      console.log(data);
    });
  }

  createRoom() {
    this.socket.emit('add_room', this.new_room.name);
    this.show_form = !this.show_form;
  }

  // getRoom(id) {
  //   const observable = this._httpService.getRoomById(id);
  //   observable.subscribe(room => {
  //       this.room_info.name = room['name'];
  //       this.room_info.members = room['members'].length;
  //   });
  // }
}
