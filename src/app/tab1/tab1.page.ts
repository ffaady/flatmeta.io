import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import { Observable, Subscriber } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

declare var what3words;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map: Leaflet.Map;
  tiles: any;
  constructor() { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadMap();
    this.map.on('zoomend', (res) => {
      if (res.target._zoom == 18) {
        this.setGrid(this.map);
      } else {
        if (this.tiles != undefined) {
          this.map.removeLayer(this.tiles);
        }
      }
    });
  }

  async loadMap() {
    if (this.map !== undefined) {
      return
    }
    this.map = Leaflet.map('mapId').setView([0, 0], 1);
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Idevation Saqib Khan',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiaWRldmUiLCJhIjoiY2wxZ2o1cnlhMWFjbTNkcGNpbGZ3djI1bSJ9.H-6HJziV9Wu75UT4gQu5Bw',
    }).addTo(this.map);

    const coordinates = await Geolocation.getCurrentPosition();
    this.map.flyTo([coordinates.coords.latitude, coordinates.coords.longitude], 13);

    const icon = Leaflet.icon({
      iconUrl: 'https://res.cloudinary.com/rodrigokamada/image/upload/v1637581626/Blog/angular-leaflet/marker-icon.png',
      shadowUrl: 'https://res.cloudinary.com/rodrigokamada/image/upload/v1637581626/Blog/angular-leaflet/marker-shadow.png',
      popupAnchor: [13, 0],
    });

    const marker = Leaflet.marker([coordinates.coords.latitude, coordinates.coords.longitude], { icon }).bindPopup('Angular Leaflet');
    marker.addTo(this.map);
  }

  setGrid(m) {
    this.tiles = new Leaflet.GridLayer();
    this.tiles.createTile = function (coords) {
      let tile = Leaflet.DomUtil.create('canvas', 'leaflet-tile');
      let ctx = tile.getContext('2d');
      let size = this.getTileSize()
      tile.width = size.x
      tile.height = size.y

      // calculate projection coordinates of top left tile pixel
      var nwPoint = coords.scaleBy(size)

      // calculate geographic coordinates of top left tile pixel
      var nw = m.unproject(nwPoint, coords.z)

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size.x, 50);
      ctx.fillStyle = 'black';
      ctx.fillText('x: ' + coords.x + ', y: ' + coords.y + ', zoom: ' + coords.z, 20, 20);
      ctx.fillText('lat: ' + nw.lat + ', lon: ' + nw.lng, 20, 40);
      ctx.strokeStyle = 'darkgrey';

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size.x - 1, 0);
      ctx.lineTo(size.x - 1, size.y - 1);
      ctx.lineTo(0, size.y - 1);
      ctx.closePath();
      ctx.stroke();
      return tile;
    }
    this.tiles.addTo(m);

  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
