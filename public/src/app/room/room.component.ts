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
    this.refresh_token = "AQAb-V7CTJiFtkEx3lqaIsv5_8y__H5r85qHCQRhz4O0i1VZJMMwMnL-htnOxbzYE_VxgKzh44tc964xEVBi7pUejLOqVeqvY-uiUQzLQ9XJn7G2goUeyLX22zJcFxNkVqo-fA";
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
    let observable = this._httpService.playSong({song_uri: song.uri, refresh_token: this.refresh_token});
    observable.subscribe(data => console.log(data));
  }

  upvote(song: any): void {
    song.upvotes++;
    this.queue.sort(function(a, b) {
      return b.upvotes - a.upvotes;
    });
  }

}
