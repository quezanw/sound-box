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

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private chat: ChatService
  ) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      console.log(params['refresh_token'])
    })
    this.chat.messages.subscribe(msg => {
      console.log("Response from chat service: " + msg);
    })
  }

  joinRoom(room: string) {
    console.log("User is joining room...")
    this.chat.joinRoom(room);
  }

}
