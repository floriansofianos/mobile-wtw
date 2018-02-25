import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TimelineServiceProvider } from '../../providers/timeline-service/timeline-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private timelineService: TimelineServiceProvider) {
    this.timelineService.get(0).subscribe(data => {
        console.log(data);
    },
  error => {
    console.log(error);
  })
  }



}
