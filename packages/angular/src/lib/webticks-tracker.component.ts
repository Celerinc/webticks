import { Component, OnInit, input } from '@angular/core';
import inject from '@webticks/core';

@Component({
    selector: 'webticks-tracker',
    template: '',
    standalone: true
})
/**
 * WebTicks Analytics Component for Angular
 */
export class WebticksAnalytics implements OnInit {
    serverUrl = input<string>();
    appId = input<string>();
    debug = input<boolean>();

    ngOnInit() {
        inject({
            serverUrl: this.serverUrl(),
            appId: this.appId(),
            debug: this.debug()
        });
    }
}
