import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileDebug from 'ol/source/TileDebug';

import Geolocation from 'ol/Geolocation';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    private zone: NgZone
  ) { }

  map: Map;

  ngOnInit(): void {
  }

  ionViewDidEnter() {
    this.zone.run(() => {
      this.getCurrentPosition().subscribe((position: any) => {
        this.map = new Map({
          view: new View({
            center: [position.latitude, position.longitude],
            zoom: 5,
          }),
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            new TileLayer({
              source: new TileDebug(),
            })
          ],
          target: 'ol-map'
        });         
      })
    });


  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

}
