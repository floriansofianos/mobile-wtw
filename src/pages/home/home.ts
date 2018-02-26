import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { TimelineServiceProvider } from '../../providers/timeline-service/timeline-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private timelineService: TimelineServiceProvider, private statusBar: StatusBar) {
    this.statusBar.styleLightContent();
    this.statusBar.backgroundColorByHexString('#2F3238');
    
    this.timelineService.get(0).subscribe(data => {
        console.log(data);
    },
  error => {
    console.log(error);
  })
  }



}
