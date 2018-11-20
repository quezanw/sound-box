import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
    this.rooms = [];
    this.errors = [];
    this.show_form = false;
    this.new_room = {};
    this.members = 0;
    this.getAllRooms();
    this._route.params.subscribe((params: Params) => {
      this.refresh_token = params['refresh_token'];
      this._httpService.setRefreshToken(this.refresh_token);
      console.log(this._httpService.refresh_token);
      this.new_room['host_token'] = this.refresh_token;
    })
  }

  joinRoom(room: string) {
    console.log("User is joining room...")
    this.socket.emit('join', room);
    this._router.navigate(['/room/' + room]);
    this.socket.on('room message', data => {
      console.log(data);
    });
  }

  showCreateRoom() {
    this.show_form = true;
  }

  getAllRooms() {
    const observable = this._httpService.getAllRooms();
    observable.subscribe(rooms => {
        console.log(rooms);
        this.rooms = rooms;
    });
  }

  createRoom() {
      console.log(this.new_room);
      const observable = this._httpService.createRoom(this.new_room);
      observable.subscribe(data => {
        console.log(data);
        if (data['errors']) {
            // console.log(data['errors']);
            // tslint:disable-next-line:forin
            for (let err in data['errors']) {
                console.log(data['errors'][err]['message']);
                this.errors.push(data['errors'][err]['message']);
            }
            console.log(this.errors);
        } else {
            this.new_room.name = '';
            this.new_room.password = '';
            this.show_form = false;
            this.getAllRooms();
        }
        this.errors = [];
      });
  }

  getRoom(id) {
    const observable = this._httpService.getRoomById(id);
    observable.subscribe(room => {
        this.room_info.name = room['name'];
        this.room_info.members = room['members'].length;
    });
  }
}
