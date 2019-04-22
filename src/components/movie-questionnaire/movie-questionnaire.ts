import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CastPage } from '../../pages/cast/cast';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';

@Component({
  selector: 'movie-questionnaire',
  templateUrl: 'movie-questionnaire.html'
})
export class MovieQuestionnaireComponent {

  @Input() movie: any;
  @Input() movieQuestionnaireInit: any;
  @Input() config: any;
  @Input() lang: string;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  trailerUrl: any;
  genres: string;
  releaseYear: string;
  movieSeen: boolean;
  seenValue: number;
  sliderConfiguration: any;
  wantToWatch: boolean;
  labelRating: string;
  jobDirector: string;
  jobWriter: string;
  backgroundImageUrl: any;

  constructor(private domSanitizer: DomSanitizer, private translate: TranslateService, public nav: NavController, private movieDBService: MovieDBServiceProvider) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movieSeen || changes.wantToWatch) {
      this.onChange();
    }
  }

  ngOnInit() {
    this.translate.get('MOVIE_QUESTIONNAIRE.DIRECTOR').subscribe((res: string) => {
      this.jobDirector = res;
    });
    this.translate.get('MOVIE_QUESTIONNAIRE.WRITER').subscribe((res: string) => {
      this.jobWriter = res;
    });
    this.getMovieTitle();
    this.getMovieOverview();
    this.getMovieVideo();
    this.getMovieGenres();
    this.getMovieActors();
    this.getMovieDirectors();
    this.getMovieWriters();
    this.trailerUrl = this.getMovieVideo();
    this.genres = this.movie.genres ? (this.movie.genres.length > 0 ? this.movie.genres.map(a => a.name).reduce((a, b) => a + ', ' + b) : '') : '';
    this.movieSeen = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.isSeen : false;
    this.seenValue = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.rating : 3;
    this.getLabelRating();
    this.wantToWatch = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.wantToSee : false;
    this.onChange();
  }

  getLabelRating() {
    let labelTranslationVar = this.seenValue === 1 ? 'MOVIE_QUESTIONNAIRE.POOR' : (this.seenValue === 2 ? 'MOVIE_QUESTIONNAIRE.AVERAGE' : (this.seenValue === 3 ? 'MOVIE_QUESTIONNAIRE.GOOD' : (this.seenValue === 4 ? 'MOVIE_QUESTIONNAIRE.VERYGOOD' : (this.seenValue === 5 ? 'MOVIE_QUESTIONNAIRE.MASTERPIECE' : 'Error!'))));
    this.translate.get(labelTranslationVar).subscribe((res: string) => {
      this.labelRating = res;
    });
  }

  getBackgroundImage() {
    const url = this.config.images.base_url + this.config.images.backdrop_sizes[2] + this.movie.backdrop_path;
    const style = `background-image: url(${url})`;

    // sanitize the style expression
    return this.domSanitizer.bypassSecurityTrustStyle(style);
  }

  isVideoPlayerDisplayed() {
    return this.trailerUrl;
  }

  getMovieVideo() {
    this.movieDBService.getMovieVideo(this.movie.id, this.translate.currentLang).subscribe(response => {
        let trailers = response.json();
        if (trailers && trailers.length > 0) {
            this.trailerUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + trailers[0].key + '?ecver=2');
        }
    },
        error => {
            throw new Error(error);
        });
}

getMovieGenres() {
    this.movieDBService.getMovieGenres(this.movie.id).subscribe(response => {
        //TODO modify response to get the appropriate labels for the genres
        //this.genres = this.movie.genres ? (this.movie.genres.length > 0 ? this.movie.genres.map(a => a.name).reduce((a, b) => a + ', ' + b) : '') : '';
        this.genres = response.json();
    },
        error => {
            throw new Error(error);
        })
}

getMovieActors() {
    this.movieDBService.getMovieActors(this.movie.id).subscribe(response => {
        this.movie.actors = response.json();
    },
        error => {
            throw new Error(error);
        })
}

getMovieDirectors() {
    this.movieDBService.getMovieDirectors(this.movie.id).subscribe(response => {
        this.movie.directors = response.json();
    },
        error => {
            throw new Error(error);
        })
}

getMovieWriters() {
    this.movieDBService.getMovieWriters(this.movie.id).subscribe(response => {
        this.movie.writers = response.json();
    },
        error => {
            throw new Error(error);
        })
}

getMovieTitle() {
    this.movieDBService.getMovieTitle(this.movie.id, this.translate.currentLang).subscribe(response => {
        this.movie.title = response.json().title;
    },
        error => {
            throw new Error(error);
        })
}

getMovieOverview() {
    this.movieDBService.getMovieOverview(this.movie.id, this.translate.currentLang).subscribe(response => {
        this.movie.overview = response.json().overview;
    },
        error => {
            throw new Error(error);
        })
}

  onChange() {
    this.notify.emit({
      isSeen: this.movieSeen,
      movieDBId: this.movie.id,
      rating: this.seenValue,
      wantToSee: this.wantToWatch
    });
  }

  onRatingChange = ($event: any) => {
    if ($event.rating) {
      this.seenValue = $event.rating;
      this.getLabelRating();
    }
    this.onChange();
  };

  movieSkip() {
    this.notify.emit({
      skipMovie: true
    })
  }

  goToCast(member: any, crewType: any, job: any) {
    this.nav.push(CastPage, { config: this.config, currentMovieId: this.movie.id, castMember: member, crewType: crewType, job: job });
  }


}
