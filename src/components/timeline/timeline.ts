import { Component, Input, ViewChild, SimpleChanges } from '@angular/core';
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
  @Input() refresh: any;
  page: number;
  isAllLoaded: boolean;
  isLoading: boolean;
  @ViewChild('scroll') scroll;

  constructor(private timelineService: TimelineServiceProvider) {
    this.page = 0;
    this.isAllLoaded = false;
  }

  ngOnChanges(changes: any) {
    this.scroll.refresh();
  }

  doInfinite(infiniteScroll) {
    if (!this.isAllLoaded) {
      this.page++;
      this.timelineService.get(this.page).subscribe(response => {
          let newEvents = response;
          if (newEvents.length < 20) {
              this.isAllLoaded = true;
          }
          this.timelineEvents = this.timelineEvents.concat(newEvents);
          //infiniteScroll.complete();
      });
    }
    //else infiniteScroll.complete();
  }

  getMonth(createdAt) {
    return (new Date(createdAt)).getMonth();
  }

}
