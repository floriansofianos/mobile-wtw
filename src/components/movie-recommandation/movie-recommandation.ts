import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MovieRecommandationServiceProvider } from '../../providers/movie-recommandation-service/movie-recommandation-service';

import { CastPage } from '../../pages/cast/cast';

import * as _ from 'underscore';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'movie-recommandation',
    templateUrl: 'movie-recommandation.html'
})
export class MovieRecommandationComponent {

    @Input() movie: any;
    @Input() movieQuestionnaireInit: any;
    @Input() config: any;
    @Input() lang: string;
    @Input() availableOnPlex: boolean;
    @Input() availableOnNetflix: boolean;
    @Output() notify: EventEmitter<any> = new EventEmitter<any>();
    @Output() notifySave: EventEmitter<any> = new EventEmitter<any>();
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
    grade: number;
    gradeLoaded: boolean;
    gradeRelevant: boolean;
    gradeComments: Array<any>;
    gradeCommentsLevels = ['WTW.HATE_', 'WTW.DISLIKE_', '', 'WTW.LIKE_', 'WTW.LOVE_'];


    constructor(private domSanitizer: DomSanitizer, private translate: TranslateService, private movieRecommandationService: MovieRecommandationServiceProvider,
         public nav: NavController) { }

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
        this.trailerUrl = this.getMovieVideo();
        this.genres = this.movie.genres ? (this.movie.genres.length > 0 ? this.movie.genres.map(a => a.name).reduce((a, b) => a + ', ' + b) : '') : '';
        this.movieSeen = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.isSeen : false;
        this.seenValue = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.rating : 3;
        this.getLabelRating();
        this.wantToWatch = this.movieQuestionnaireInit ? this.movieQuestionnaireInit.wantToSee : false;
        this.gradeLoaded = false;
        this.movieRecommandationService.getScore(this.movie.id).subscribe(response => {
            var data = response;
            this.gradeRelevant = data.certaintyLevel >= 3;
            this.grade = Math.floor(data.score);
            this.gradeComments = _.map(data.comments, function (c) {
                return { isGood: c.level > 0, text: this.gradeCommentsLevels[c.level + 2] + c.type, name: c.name };
            }, this);

            this.gradeLoaded = true;
        },
            error => {
                throw new Error(error);
            });
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

    getAllTrailers() {
        if (this.movie.trailers) {
            let trailers = this.movie.trailers.filter(
                t => t.type === 'Trailer' && t.site === 'YouTube');
            return trailers;
        }
        else return null;
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

    isVideoPlayerDisplayed() {
        let trailers = this.getAllTrailers();
        if (trailers) {
            return trailers.length > 0;
        }
        else return false;
    }

    clickSave() {
        this.notifySave.emit({
            clickSave: true
        });
    }

    goToCast(member: any, crewType: any, job: any) {
        this.nav.push(CastPage, { config: this.config, currentMovieId: this.movie.id, castMember: member, crewType: crewType, job: job });
    }

    getBackgroundImage() {
        const url = this.config.images.base_url + this.config.images.backdrop_sizes[2] + this.movie.backdrop_path;
        const style = `background-image: url(${url})`;
    
        // sanitize the style expression
        return this.domSanitizer.bypassSecurityTrustStyle(style);
      }

}
