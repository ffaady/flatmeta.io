import { Component } from '@angular/core';
import { GeneralService } from '../providers/general.service';
import { EventsService } from '../providers/events.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public general: GeneralService,
    public events: EventsService
  ) { }

  toHome() {
    this.events.publishToHome(true);
  }

}
