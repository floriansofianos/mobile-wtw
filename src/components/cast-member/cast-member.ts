import { Component, Input } from '@angular/core';

@Component({
  selector: 'cast-member',
  templateUrl: 'cast-member.html'
})
export class CastMemberComponent {

  @Input() castMember: any;
  @Input() lang: string;
  @Input() config: any;
  @Input() job: string;
  @Input() crewType: number;
  @Input() currentMovieId: number;

  constructor() { }

  isImgProfile(file: string) {
    if (file === null || file === '') return false;
    else return true;
  }

}
