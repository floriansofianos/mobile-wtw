import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';

@Component({
  selector: 'movie-wall',
  templateUrl: 'movie-wall.html'
})
export class MovieWallComponent {

  @Input() movieIds: Array<string>;
  @Input() lang: string;
  @Input() config: any;
  @Input() width: number;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  movies: Array<any>;
  dataLoaded: boolean;

  constructor(private movieDBService: MovieDBServiceProvider) {
    if (!this.width) this.width = 100;
    this.dataLoaded = false;
    console.log(this.movieIds)
    this.movieDBService.getMovies(this.movieIds, this.lang).subscribe(data => {
      this.movies = data;
      this.dataLoaded = true;
    },
      err => {
        console.log(err);
      });
  }

  showQuestionnaire(id: number) {
    this.notify.emit({
      movieId: id
    });
  }

}
