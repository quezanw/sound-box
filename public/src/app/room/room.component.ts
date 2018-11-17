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

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.queue = [];
    this.searchSong = '';
    this.searchResults = [];
  }

  findSong(): void {
    let observable = this._httpService.getSong(this.searchSong);
    observable.subscribe(data => {
      console.log(data)
      console.log("rulesss");
      this.searchResults = data['body']['body']['tracks']['items'];
      this.searchSong = '';
    });
  }

}
