import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { CastPage } from '../../pages/cast/cast';

import * as _ from 'underscore';

@Component({
  selector: 'tv-questionnaire-element',
  templateUrl: 'tv-questionnaire-element.html'
})
export class TvQuestionnaireElementComponent {

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
  jobCreator: string;
  jobWriter: string;
  backgroundImageUrl: any;

  constructor(private domSanitizer: DomSanitizer, private translate: TranslateService, public nav: NavController) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movieSeen || changes.wantToWatch) {
      this.onChange();
    }
  }

  ngOnInit() {
    this.translate.get('MOVIE_QUESTIONNAIRE.CREATOR').subscribe((res: string) => {
      this.jobCreator = res;
    });
    this.translate.get('MOVIE_QUESTIONNAIRE.WRITER').subscribe((res: string) => {
      this.jobWriter = res;
    });
    this.trailerUrl = this.getMovieVideo();
    this.genres = this.movie.tvShowInfo.genres ? (this.movie.tvShowInfo.genres.length > 0 ? this.movie.tvShowInfo.genres.map(a => a.name).reduce((a, b) => a + ', ' + b) : '') : '';
    this.movieSeen = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.isSeen : false;
    this.seenValue = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.rating : 3;
    // Get writers and actors from tv show
    var allWriters = _.filter(this.movie.tvShowCredits.crew, function (m) { return m.job === 'Screenplay' || m.job === 'Writer'; });
    var allActors = this.movie.tvShowCredits.cast;
    this.movie.writers = _.sortBy(allWriters, 'numberOfEpisodes').reverse().slice(0, Math.min(allWriters.length, 5));
    this.movie.actors = allActors.slice(0, Math.min(allActors.length, 6));
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

  getMovieVideo() {
    let trailers = this.getAllTrailers();
    if (trailers && trailers.length > 0) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + trailers[0].key + '?ecver=2');
    }
    else return null;
  }

  getBackgroundImage() {
    const url = this.config.images.base_url + this.config.images.backdrop_sizes[2] + this.movie.tvShowInfo.backdrop_path;
    const style = `background-image: url(${url})`;

    // sanitize the style expression
    return this.domSanitizer.bypassSecurityTrustStyle(style);
  }

  getAllTrailers() {
    if (this.movie.trailers) {
      let trailers = this.movie.trailers.results.filter(
        t => t.type === 'Trailer' && t.site === 'YouTube');
      return trailers;
    }
    else return null;
  }

  onChange() {
    this.notify.emit({
      isSeen: this.movieSeen,
      movieDBId: this.movie.tvShowInfo.id,
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

  isVideoPlayerDisplayed() {
    let trailers = this.getAllTrailers();
    if (trailers) {
      return trailers.length > 0;
    }
    else return false;
  }

  goToCast(member: any, crewType: any, job: any) {
    this.nav.push(CastPage, { config: this.config, currentMovieId: this.movie.tvShowInfo.id, castMember: member, crewType: crewType, job: job });
  }

}
