import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'underscore'

import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { MoviePage } from '../../pages/movie/movie';
import { TvShowPage } from '../../pages/tv-show/tv-show';
import { UserPage } from '../../pages/user/user';

@Component({
    selector: 'timeline-event-rate-movie',
    templateUrl: 'timeline-event-rate-movie.html'
})
export class TimelineEventRateMovieComponent {
    @Input() curUserId: number;
    @Input() friends: Array<any>;
    @Input() isCurUserYou: boolean;
    @Input() questionnaire: any;
    @Input() isTV: boolean;
    @Input() config: any;
    @Input() lang: string;
    @Input() createdAt: any;
    curUsername: string;
    isLoading: boolean;
    movie: any;

    constructor(private movieDBService: MovieDBServiceProvider, private nav: NavController) {
    }

    ngOnInit() {
        this.isLoading = true;
        if (!this.isCurUserYou) {
            var curUserId = this.curUserId;
            this.curUsername = _.find(this.friends, function (f) { return f.userId == curUserId }).username;
        }
        if (!this.isTV) {
            this.movieDBService.getMovie(this.questionnaire.movieDBId, this.lang).subscribe(data => {
                this.movie = data;
                this.isLoading = false;
            },
                err => {
                    console.log(err);
                });
        }
        else {
            this.movieDBService.getTV(this.questionnaire.movieDBId, this.lang).subscribe(data => {
                this.movie = data;
                this.isLoading = false;
            },
                err => {
                    console.log(err);
                });
        }

    }

    getMonth(createdAt) {
        return (new Date(createdAt)).getMonth();
    }

    goToMovie(id) {
        this.nav.push(MoviePage, { id: id });
    }

    goToTv(id) {
        this.nav.push(TvShowPage, { id: id });
    }

    getFontSize(title: string) {
        if(title.length < 20) {
            return '22px';
        }
        else if(title.length < 35) {
            return '20px';
        }
        else if(title.length < 50) {
            return '16px';
        }
        else return '14px'; 
    }

    getLineHeight(title: string) {
        if(title.length < 20) {
            return '27px';
        }
        else if(title.length < 35) {
            return '25px';
        }
        else if(title.length < 50) {
            return '21px';
        }
        else return '19px'; 
    }

    goToUser(id) {
        this.nav.push(UserPage, { id: id });
    }
}
