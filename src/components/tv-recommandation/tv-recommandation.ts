import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TvRecommandationServiceProvider } from '../../providers/tv-recommandation-service/tv-recommandation-service';

import { CastPage } from '../../pages/cast/cast';

import * as _ from 'underscore';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'tv-recommandation',
    templateUrl: 'tv-recommandation.html'
})
export class TvRecommandationComponent {

    @Input() tv: any;
    @Input() tvQuestionnaireInit: any;
    @Input() config: any;
    @Input() lang: string;
    @Input() availableOnPlex: boolean;
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
    jobCreator: string;
    jobWriter: string;
    grade: number;
    gradeLoaded: boolean;
    gradeRelevant: boolean;
    gradeComments: Array<any>;
    gradeCommentsLevels = ['WTW.HATE_', 'WTW.DISLIKE_', '', 'WTW.LIKE_', 'WTW.LOVE_'];


    constructor(private domSanitizer: DomSanitizer, private translate: TranslateService, private tvRecommandationService: TvRecommandationServiceProvider,
         public nav: NavController) { }

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
        this.trailerUrl = this.getTVVideo();
        this.genres = this.tv.tvShowInfo.genres ? (this.tv.tvShowInfo.genres.length > 0 ? this.tv.tvShowInfo.genres.map(a => a.name).reduce((a, b) => a + ', ' + b) : '') : '';
        this.movieSeen = this.tvQuestionnaireInit ? this.tvQuestionnaireInit.isSeen : false;
        this.seenValue = this.tvQuestionnaireInit ? this.tvQuestionnaireInit.rating : 3;
        this.getLabelRating();
        this.wantToWatch = this.tvQuestionnaireInit ? this.tvQuestionnaireInit.wantToSee : false;
        this.gradeLoaded = false;
        this.tvRecommandationService.getScore(this.tv.tvShowInfo.id).subscribe(response => {
            var data = response;
            this.gradeRelevant = data.certaintyLevel >= 3;
            this.grade = Math.floor(data.score);
            this.gradeComments = _.map(data.comments, function (c) {
                return { isGood: c.level > 0, text: this.gradeCommentsLevels[c.level + 2] + c.type, name: c.name };
            }, this);

            this.gradeLoaded = true;
        },
            error => {
                console.log(error);
            });
        this.onChange();
    }

    getLabelRating() {
        let labelTranslationVar = this.seenValue === 1 ? 'MOVIE_QUESTIONNAIRE.POOR' : (this.seenValue === 2 ? 'MOVIE_QUESTIONNAIRE.AVERAGE' : (this.seenValue === 3 ? 'MOVIE_QUESTIONNAIRE.GOOD' : (this.seenValue === 4 ? 'MOVIE_QUESTIONNAIRE.VERYGOOD' : (this.seenValue === 5 ? 'MOVIE_QUESTIONNAIRE.MASTERPIECE' : 'Error!'))));
        this.translate.get(labelTranslationVar).subscribe((res: string) => {
            this.labelRating = res;
        });
    }

    getTVVideo() {
        let trailers = this.getAllTrailers();
        if (trailers && trailers.length > 0) {
            return this.domSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + trailers[0].key + '?ecver=2');
        }
        else return null;
    }

    getAllTrailers() {
        if (this.tv.trailers) {
            let trailers = this.tv.trailers.results.filter(
                t => t.type === 'Trailer' && t.site === 'YouTube');
            return trailers;
        }
        else return null;
    }

    onChange() {
        this.notify.emit({
            isSeen: this.movieSeen,
            movieDBId: this.tv.tvShowInfo.id,
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
        this.nav.push(CastPage, { config: this.config, currentMovieId: this.tv.tvShowInfo.id, castMember: member, crewType: crewType, job: job });
    }

}
