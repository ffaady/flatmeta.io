import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import * as Leaflet from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import * as GeoSearch from 'leaflet-geosearch';
const provider = new GeoSearch.OpenStreetMapProvider();


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  map: Leaflet.Map;
  tiles: any = undefined;

  selectedBoxs = [];
  soldBoxes = [];
  myBoxs = [];

  user_id = GlobaldataService.userObject != undefined ? GlobaldataService.userObject.id : null;

  imgSelection: boolean = false;
  boxImgs = [];
  selectedImg:string = undefined;

  constructor(
    public storage: StorageService,
    public general: GeneralService,
    public http: HttpService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadMap();
    this.getBoxImgs();
    this.map.on('zoomend', (res) => {
      if (res.target._zoom == 20) {
        if (this.tiles == undefined) {
          this.setGrid(this.map);
        }
      } else {
        if (this.tiles != undefined) {
          this.map.removeLayer(this.tiles);
          this.tiles = undefined;
        }
      }
    });

    this.getSoldBox();
  }

  getSoldBox() {
    this.http.get2('GetSelectedTiles', true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.soldBoxes = res.data.tiles;
      }
    },
      (e) => {
        this.general.stopLoading();
        console.log(e)
      })
  }

  async loadMap() {
    if (this.map !== undefined) {
      return
    }
    this.map = Leaflet.map('mapId').setView([0, 0], 1);
    //Leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?access_token={accessToken}', {
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Idevation Saqib Khan',
      maxZoom: 20,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiaWRldmUiLCJhIjoiY2wxZ2o1cnlhMWFjbTNkcGNpbGZ3djI1bSJ9.H-6HJziV9Wu75UT4gQu5Bw',
    }).addTo(this.map);

    const coordinates = await Geolocation.getCurrentPosition();
    this.map.flyTo([coordinates.coords.latitude, coordinates.coords.longitude], 13);

    const search = GeoSearch.GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      searchLabel: 'Search Map',
      retainZoomLevel: true
    });
    this.map.addControl(search);
  }

  setGrid(m) {
    let that = this;
    this.tiles = new Leaflet.GridLayer({
      tileSize: 40,
      opacity: 0.8,
      updateWhenZooming: false,
      updateWhenIdle: false,
      minNativeZoom: 20,
      maxNativeZoom: 25,
    });
    this.tiles.createTile = function (coords) {
      let tile = Leaflet.DomUtil.create('canvas', 'leaflet-tile');
      let ctx = tile.getContext('2d');
      let size = this.getTileSize();
      tile.width = size.x;
      tile.height = size.y;

      // calculate projection coordinates of top left tile pixel
      var nwPoint = coords.scaleBy(size)
      nwPoint.clientHeight = 80;
      nwPoint.clientWidth = 80;
      // calculate geographic coordinates of top left tile pixel
      var nw = m.unproject(nwPoint, coords.z);

      //ctx.fillStyle = 'white';
      //ctx.fillRect(0, 0, size.x, 50);
      //ctx.fillStyle = 'black';
      //ctx.fillText('x: ' + coords.x + ', y: ' + coords.y + ', zoom: ' + coords.z, 20, 20);
      //ctx.fillText('lat: ' + nw.lat + ', lon: ' + nw.lng, 20, 40);

      let fb = undefined;
      fb = that.soldBoxes.find(e => nw.lat == e.lat && nw.lng == e.lng);
      if (fb != undefined) {
        let mb = undefined;
        mb = that.soldBoxes.find(e => nw.lat == e.lat && nw.lng == e.lng && e.user_id == that.user_id);
        if (mb != undefined) {
          ctx.strokeStyle = 'green'; // if my box
        } else {
          ctx.strokeStyle = 'red'; // if other user box
        }
      } else {
        ctx.strokeStyle = 'grey'; // available box
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size.x - 1, 0);
      ctx.lineTo(size.x - 1, size.y - 1);
      ctx.lineTo(0, size.y - 1);
      ctx.closePath();
      ctx.stroke();
      tile.addEventListener('click', (e) => {
        let cb = undefined;
        cb = that.soldBoxes.find(c => nw.lat == c.lat && nw.lng == c.lng);

        if (cb != undefined) {
          //check here if this box exists in my bought boxes add orange class or else unselect it
          let mb = undefined;
          mb = that.soldBoxes.find(d => nw.lat == d.lat && nw.lng == d.lng && d.user_id == that.user_id);
          if (mb != undefined) { // checking if box i bought by me
            let m = undefined;
            m = that.myBoxs.filter(h => nw.lat == h.lat && nw.lng == h.lng);
            if (m.length != 0) {
              let i = that.myBoxs.findIndex(i => (i.lat == nw.lat && i.lng == nw.lng));
              that.myBoxs.splice(i, 1);
              e.srcElement.classList.toggle('my-box');
            } else {
              e.srcElement.classList.toggle('my-box');
              that.myBoxs.push(cb)
            }
          }
        } else {
          let r = undefined;
          r = that.selectedBoxs.filter(f => nw.lat == f.lat && nw.lng == f.lng);
          if (r.length != 0) {
            let i = that.selectedBoxs.findIndex(g => (g.lat == nw.lat && g.lng == nw.lng));
            that.selectedBoxs.splice(i, 1);
            e.srcElement.classList.toggle('border-show');
          } else {
            e.srcElement.classList.toggle('border-show');
            that.selectedBoxs.push({ lat: nw.lat, lng: nw.lng, img: null });
          }
        }
      });
      return tile;
    }
    this.tiles.addTo(m);

  }

  removeSelectedBoxes() {
    this.selectedBoxs = [];
  }

  removeMyBoxes() {
    this.myBoxs = [];
  }

  buyNow() {
    if (GlobaldataService.userObject == undefined) {
      this.general.presentToast('Please Login to Continue');
      this.general.goToPage('login');
    } else {
      let save = {
        boxs: this.selectedBoxs,
        user_id: GlobaldataService.userObject.id,
      }
      this.http.post2('AddTiles', save, true).subscribe((res: any) => {
        this.general.stopLoading()
        if (res.status == true) {
          this.getSoldBox();
          this.general.presentToast('Boxes bought successfully!');
          this.map.removeLayer(this.tiles);
          this.soldBoxes = [];
          this.selectedBoxs = [];
          this.tiles = undefined;
          setTimeout(() => {
            this.setGrid(this.map);
          }, 2000)
        }
      },
        (e) => {
          this.general.stopLoading()
          console.log(e)
        })
    }
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

  getBoxImgs() {
    this.http.get2('BoxImages', false).subscribe((res: any) => {
      if (res.status == true) {
        this.boxImgs = res.data;
      }
    }, (e) => {
      console.log(e)
    })
  }

  confirmImg(){
    this.myBoxs.forEach(e=>{
      e.img = this.selectedImg;
    })
    console.log(this.myBoxs);

    
  }


}
