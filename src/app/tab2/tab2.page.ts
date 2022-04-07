import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileDebug from 'ol/source/TileDebug';
import { Geolocation } from '@capacitor/geolocation';

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
      this.loadMap()
    });
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.map = new Map({
      view: new View({
        center: [coordinates.coords.latitude, coordinates.coords.longitude],
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
  }

}
