import { Component } from '@angular/core';
import { GeneralService } from '../providers/general.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public general: GeneralService
  ) { }

}
