import { Component, Input } from '@angular/core';
import { TimelineServiceProvider } from '../../providers/timeline-service/timeline-service';


@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class TimelineComponent {

  @Input() timelineEvents: Array<any>;
  @Input() friends: Array<any>;
  @Input() currentUserId: number;
  @Input() lang: string;
  @Input() config: any;
  page: number;
  isAllLoaded: boolean;

  constructor(private timelineService: TimelineServiceProvider) {
    this.page = 0;
    this.isAllLoaded = false;
  }

  doInfinite(infiniteScroll) {
    if (!this.isAllLoaded) {
      this.page++;
      this.timelineService.get(this.page).subscribe(response => {
          let newEvents = response.json();
          if (newEvents.length < 20) {
              this.isAllLoaded = true;
          }
          this.timelineEvents = this.timelineEvents.concat(newEvents);
          infiniteScroll.complete();
      });
    }
  }

}
