import { Component, OnInit } from '@angular/core';
import inject from '@webticks/core';

@Component({
    selector: 'webticks-tracker',
    template: '',
    standalone: true
})
export class WebticksAnalytics implements OnInit {
    ngOnInit() {
        inject();
    }
}
