import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifySave: EventEmitter<any> = new EventEmitter<any>();


  constructor() {

  }

}
