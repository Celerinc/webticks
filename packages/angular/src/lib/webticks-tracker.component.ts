import { Component, OnInit, input } from '@angular/core';
import inject from '@webticks/core';

@Component({
    selector: 'webticks-tracker',
    template: '',
    standalone: true
})
export class WebticksAnalytics implements OnInit {
    backendUrl = input<string>();
    appId = input<string>();

    ngOnInit() {
        inject({
            backendUrl: this.backendUrl(),
            appId: this.appId()
        });
    }
}
