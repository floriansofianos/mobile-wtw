import { Component, Input } from '@angular/core';

@Component({
  selector: 'movie-wall-element',
  templateUrl: 'movie-wall-element.html'
})
export class MovieWallElementComponent {

  @Input() movie: any;
  @Input() config: any;
  @Input() width: number;
  height: number;
  fontSize: number;
  marginTop: number;

  constructor() {
    
  }

  ngOnInit() {
    this.height = Math.floor(this.width * 1.5);
    this.fontSize = this.width < 100 ? 30 : (this.width < 200 ? 40 : (this.width < 300 ? 60 : 70));
    this.marginTop = Math.floor(this.height / 2) - Math.floor(this.fontSize / 2);
  }

}
