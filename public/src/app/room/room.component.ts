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
    this.refresh_token = this._httpService.getRefreshToken();
    console.log(this.refresh_token)
  }

  findSong(value: string): void {
    const observable = this._httpService.getSong(this.searchSong, this.refresh_token);
    observable.subscribe(data => {
      console.log(data);
      this.searchResults = data['body']['body']['tracks']['items'];
      this.searchSong = '';
    });
  }

}
