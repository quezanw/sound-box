import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

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
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.queue = [];
    this.searchSong = '';
    this.searchResults = [];
    // this.refresh_token = this._httpService.getRefreshToken();
    this.refresh_token = "AQBqtmf4QZ7R6TXf04FVHgpBl7hrV6qEB9rB0R2SMpUbAw9AGeGE9x75ZiNzBsNjmSysCSxSs5w3uYT2RN4hY2XOkqiXGV13-sAhV9tB1iKk3PYn4B7QKOQwcC7i0d7GIQrkkQ";
    console.log(this.refresh_token)
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
    console.log(song);
    this.searchResults = [];
    this.queue.push({info: song, upvotes: 0});
  }

  upvote(song: any): void {
    song.upvotes++;
    this.queue.sort(function(a, b) {
      return b.upvotes - a.upvotes;
    });
  }

}
