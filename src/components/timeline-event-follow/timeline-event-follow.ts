import { Component, Input } from '@angular/core';
import * as _ from 'underscore';
import { UserPage } from '../../pages/user/user';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'timeline-event-follow',
    templateUrl: 'timeline-event-follow.html'
})
export class TimelineEventFollowComponent {

    friendUsername: string;
    @Input() friendUserId: number;
    @Input() curUserId: number;
    @Input() friends: Array<any>;
    @Input() isCurUserYou: boolean;
    @Input() isFriendUserYou: boolean;
    @Input() curUsername: string;
    @Input() createdAt: any;

    constructor(private nav: NavController) {
    }

    ngOnInit() {
        if (!this.isFriendUserYou) {
            var curUserId = this.friendUserId;
            this.friendUsername = _.find(this.friends, function (f) { return f.userId == curUserId }).username;
        }
    }

    getMonth(createdAt) {
        return (new Date(createdAt)).getMonth();
    }

    goToUser(id) {
        this.nav.push(UserPage, { id: id });
    }
}
