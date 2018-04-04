import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { SpinnerModule } from 'angular2-spinner';




@NgModule({
	declarations: [
    ],
    imports: [CommonModule,
        VirtualScrollModule,
        IonicModule, 
        StarRatingModule,
        SpinnerModule,
    TranslateModule],
	exports: [
    ]
})
export class ComponentsModule {}
