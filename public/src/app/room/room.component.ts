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

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.queue = [];
    this.searchSong = '';
  }

  findSong(): void {
    console.log(this.searchSong)
  }

}
