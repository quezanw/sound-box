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
  roomID: string;
  socket: SocketIOClient.Socket;
  userID: string;
  users: any[];

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute
  ) 
  {
    this.socket = this._httpService.socket;
  }

  ngOnInit() {
    this.searchSong = '';
    this.searchResults = [];
    this._route.params.subscribe((params: Params) => {
      this.roomID = params['room_id'];
      this.userID = params['user_id'];
    });
    this.users = [];

    this.socket.on('room_joined', room => {
      console.log("Someone has joined", room.room_name);
      this.queue = room.queue;
      this.currentSong = room.current_song;
      this.refresh_token = room.refresh_token;
      this.users = room.users;
    });

    this.socket.on('song_queue', data => {
      this.queue = data.queue;
      console.log(this.queue)
      console.log("Host ID:", data.host_id);
      console.log("User ID:", this.userID)
      if (!this.currentSong && data.host_id == this.userID) {
        this.playSong();
      }
    });

    this.socket.on('song_upvoted', data => {
      this.queue = data;
    });

    this.socket.on('dequeued_song', data => {
      this.currentSong = data.current_song;
      this.queue = data.queue;
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
    this.socket.emit('upvote', {song: song, user_id: this.userID});
  }

  checkVoted(song: any) {
    if (song.users_voted[this.userID]) {
      return true;
    }
    return false;
  }

  playSong(): void {
    if (this.queue.length > 0) {
      this.currentSong = this.queue[0];
      this.socket.emit('remove_song', "Dequeueing song");
      let observable = this._httpService.playSong({song_uri: this.currentSong.info.uri, refresh_token: this.refresh_token});
      observable.subscribe(data => {
        let duration = this.currentSong.info.duration_ms;
        var el: HTMLElement = document.getElementById('progress');
        let width = 1;
        let currTime = 100;
        var id = setInterval(frame, 500);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
          } else {
            currTime += 500; 
            width = (currTime / (duration + 1000)) * 100;
            el.setAttribute('style', 'width:' + width + '%;');
          }
        }
        setTimeout(() => this.playSong(),this.currentSong.info.duration_ms + 2000);
      });
    } else {
      // emit through socket
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
