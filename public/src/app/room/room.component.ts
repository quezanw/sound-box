import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  queue: any[];
  searchSong: string;
  searchResults: any[];
  refresh_token: string;
  currentSong: any;
  upvoted: boolean;
  roomID: string;
  socket: SocketIOClient.Socket;
  playing: boolean;
  userID: string;
  users: any[];

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute
    ) {
      this.socket = this._httpService.socket;
   }

  ngOnInit() {
    this.searchSong = '';
    this.searchResults = [];
    // this.refresh_token =
    // 'AQBqvh6IcxG30MwQJS17whnGw9K1tXCWu5tR3n-EOStj4eow_XG1M2ciabjAzdlRVoVgu_VtdnuxEiGt5Akw7jQuq8Q_KxfUaxAxRX-ycc5SjwrE4EWIl2dVbuDGWQ-hHlP1VQ';
    // "AQAb-V7CTJiFtkEx3lqaIsv5_8y__H5r85qHCQRhz4O0i1VZJMMwMnL-htnOxbzYE_VxgKzh44tc964xEVBi7pUejLOqVeqvY-uiUQzLQ9XJn7G2goUeyLX22zJcFxNkVqo-fA";
    this.currentSong = null;
    this.upvoted = true;
    this.playing = false;
    this._route.params.subscribe((params: Params) => {
      this.roomID = params['room_id'];
    });
    this.users = [];
    this.socket.on('room_joined', room => {
      console.log("Someone has joined", room.room_name);
      this.queue = room.queue;
      this.refresh_token = room.refresh_token;
      this.users = room.users;
    });
    this.socket.on('song_queue', data => {
      this.queue = data;
      console.log(this.queue)
      if (!this.currentSong) {
        this.playSong();
      }
    });
    this.socket.on('song_upvoted', song => {
      for (let i = 0; i < this.queue.length; i++) {
        if (this.queue[i].info.name == song.info.name) {
          this.queue[i].upvotes++;
        }
      } 
      // this.upvoted = false;
      this.queue.sort(function(a, b) {
        return b.upvotes - a.upvotes;
      });
    });
  }

  findSong(): void {
    const observable = this._httpService.getSong(this.searchSong, this.refresh_token);
    observable.subscribe(data => {
      console.log(data);
      this.searchResults = data['body']['body']['tracks']['items'];
      this.searchSong = '';
    });
  }

  addSong(song: any): void {
    this.searchResults = [];
    this.socket.emit('add_song', song);
  }

  upvote(song: any, el: HTMLInputElement): void {
    el.disabled = true;
    console.log('Upvoting song: ' + song.info.name);
    this.socket.emit('upvote', song);
  }

  playSong(): void {
    if (!this.playing && this.queue.length > 0) {
      this.playing = true;
      this.currentSong = this.queue[0];
      this.queue.shift();
      console.log("length of queue after remove " + this.queue.length);
      let observable = this._httpService.playSong({song_uri: this.currentSong.info.uri, refresh_token: this.refresh_token});
      observable.subscribe(data => {
        this.playing = false;
        setTimeout(() => this.playSong(), this.currentSong.info.duration_ms + 2000);  
      }); 
    } else {
      this.currentSong = null;
    }
    //   let el = document.getElementById('progress');
    //   console.log(el);
    //   var width = 1;
    //   var id = setInterval(frame, 1000);
    //   function frame() {
    //     if (width >= 100) {
    //       clearInterval(id);
    //     } else {
    //       width++;
    //       el.setAttribute('style', 'width:' + width + '%;');
    //     }
    //   }
  }

}

// tslint:disable-next-line:max-line-length
// when room is created by a host their refresh token is saved to the room document as the refresh token to use when any other user makes an api call to search and add a song to the queue
