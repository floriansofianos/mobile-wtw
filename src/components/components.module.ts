import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

import { TimelineEventRateMovieComponent } from './timeline-event-rate-movie/timeline-event-rate-movie';
import { TimelineEventFollowComponent } from './timeline-event-follow/timeline-event-follow';
import { TimelineEventFriendComponent } from './timeline-event-friend/timeline-event-friend';

@NgModule({
	declarations: [TimelineEventRateMovieComponent,
    TimelineEventFollowComponent,
    TimelineEventFriendComponent
    ],
    imports: [CommonModule,
        VirtualScrollModule,
        IonicModule, 
        StarRatingModule,
    TranslateModule],
	exports: [TimelineEventRateMovieComponent,
    TimelineEventFollowComponent,
    TimelineEventFriendComponent
    ]
})
export class ComponentsModule {}
