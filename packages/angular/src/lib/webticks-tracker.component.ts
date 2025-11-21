import { Component, OnInit } from '@angular/core';
import inject from '@webticks/core';

@Component({
    selector: 'webticks-tracker',
    template: '',
    standalone: true
})
export class WebticksTrackerComponent implements OnInit {
    ngOnInit() {
        inject();
    }
}
