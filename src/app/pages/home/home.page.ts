import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { StorageService } from 'src/app/providers/storage.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { EventsService } from 'src/app/providers/events.service';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';

import * as Leaflet from 'leaflet';
import * as GeoSearch from 'leaflet-geosearch';
import DriftMarker from "leaflet-drift-marker";

import { ModalController } from '@ionic/angular';
import { ChatComponent } from 'src/app/components/chat/chat.component';

import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

const provider = new GeoSearch.OpenStreetMapProvider();


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  ShowtopPop: boolean = true;
  map: Leaflet.Map;
  tiles: any = undefined;

  showBuyBtn: boolean = false;

  selectedBoxs = [];
  soldBoxes = [];
  myBoxs = [];

  user_id = GlobaldataService.userObject != undefined ? GlobaldataService.userObject.user_id : null;

  imgSelection: boolean = false;
  boxImgs = [];
  boxImgs2 = [];
  selectedImg: any = undefined;
  showUplaodedImage: boolean = false;

  showEditor: boolean = false;

  qEditor: any;

  avatar: string;
  myMarker: any;
  otherUsers = [];
  otherMarkers = [];

  myTiles = [];

  showSellModal: boolean = false;
  tilePrice: number = 0.1;

  reportPopover: boolean = false;
  reportList = [];
  toReportUser: any = undefined;
  prevZoom: any;

  constructor(
    private route: ActivatedRoute,
    public routerOutlet: IonRouterOutlet,
    public storage: StorageService,
    public general: GeneralService,
    public http: HttpService,
    private locationAccuracy: LocationAccuracy,
    private socket: Socket,
    private renderer: Renderer2,
    public modalController: ModalController,
    public events: EventsService
  ) { }

  ngOnInit() {
    this.events.receiveToUser().subscribe((res: any) => {
      if (res) {
        this.goTo("Home Page", "FlatMeta | Buy / Sell Virtual Land", `flatmeta/home/${res.id + '/' + res.username}`);
        this.getUserTilesbyId(res.id);
      }
    })

    this.getEmitLocation().subscribe((data: any) => {
      this.addOtherMarkers(data.data);
    });
  }

  toAvatarLocation() {
    setTimeout(() => {
      if (this.tiles != undefined) {
        this.map.removeLayer(this.tiles);
      }
      this.map.flyTo([this.myMarker._latlng.lat, this.myMarker._latlng.lng], this.map.getZoom());
      setTimeout(()=>{
        this.myMarker.slideTo(this.map.getCenter(), { duration: 100 });
        this.emitLocation(this.map.getCenter())
      }, 500)
    }, 500)
  }

  goTo(page, title, url) {
    if ("undefined" !== typeof history.pushState) {
      history.pushState({ page: page }, title, url);
    } else {
      window.location.assign(url);
    }
  }

  getUserTilesbyId(id) {
    this.http.get2('GetUserTilesByOrderId/' + id, false).subscribe((res: any) => {
      if (res.status == true) {
        setTimeout(() => {
          this.map.flyTo([res.data.tiles[0].lat, res.data.tiles[0].lng], 15);
        }, 500)
      }
    }, (e) => {
      console.log(e)
    })
  }

  ionViewWillEnter() {
    if (this.tiles != undefined) {
      this.map.removeLayer(this.tiles);
      this.imgSelection = false;
      this.selectedImg = '';
      this.soldBoxes = [];
      this.selectedBoxs = [];
      this.myBoxs = [];
      this.tiles = undefined;
    }
  }

  ionViewWillLeave() {
    if (this.tiles != undefined) {
      this.map.removeLayer(this.tiles);
      this.imgSelection = false;
      this.selectedImg = '';
      this.soldBoxes = [];
      this.selectedBoxs = [];
      this.myBoxs = [];
      this.tiles = undefined;
    }
  }

  ionViewDidEnter() {
    this.getSoldBox();
    this.getBoxImgs();
    this.getReportList();
    setTimeout(() => {
      this.getMapUser();
    }, 1500);
    this.loadMap();
  }

  showGrid() {
    if (this.tiles == undefined) {
      this.setGrid(this.map);
      if (this.myMarker != undefined) {
        this.map.removeLayer(this.myMarker);
      }
    } else {
      if (this.tiles != undefined) {
        this.selectedBoxs = [];
        this.myBoxs = [];
        this.map.removeLayer(this.tiles);
        this.tiles = undefined;
      }
      this.addMarker();
    }
  }

  getSoldBox() {
    this.http.get2('PurchasedTiles', false).subscribe((res: any) => {
      if (res.status == true) {
        this.soldBoxes = res.data.tiles;
      }
    },
      (e) => {
        console.log(e)
      })
  }

  async loadMap() {
    if (this.map !== undefined) {
      return
    }
    this.map = Leaflet.map('mapId', {
      scrollWheelZoom: 'center',
      touchZoom: false,
      doubleClickZoom: false
    }).setView([0, 0], 1);
    //Leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?access_token={accessToken}', {
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Buy / Customise land',
      maxZoom: 15,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiaWRldmUiLCJhIjoiY2wxZ2o1cnlhMWFjbTNkcGNpbGZ3djI1bSJ9.H-6HJziV9Wu75UT4gQu5Bw',
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('FlatMeta.io');
    let coordinates;

    // Native platform and web condition for permission on mobile apps
    if (Capacitor.isNativePlatform()) {
      const canRequest: boolean = await this.locationAccuracy.canRequest();
      if (canRequest) {
        let req = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        if (req.code == 1 || req.code == 0) {
          coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        } else {
          this.general.presentAlert('Warning!', 'Please Grant Location Permission. Otherwise App will not work as expected!')
        }
      } else {
        coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      }
    } else {
      coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    }

    //setting map to curent location
    this.map.flyTo([coordinates.coords.latitude, coordinates.coords.longitude], 15);
    let allowZooms = [5, 10, 15];
    this.map.setView = function (center, zoom, options) {
      if ((zoom) && (allowZooms.indexOf(zoom) === -1)) {
        let ixCurZoom = allowZooms.indexOf(this._zoom);
        let dir = (zoom > this._zoom) ? 1 : -1;
        if (allowZooms[ixCurZoom + dir]) {
          zoom = allowZooms[ixCurZoom + dir];
        } else {
          return this;
        }
      }
      return Leaflet.Map.prototype.setView.call(this, center, zoom, options);
    }

    //adding search-bar 
    setTimeout(() => {
      const search = GeoSearch.GeoSearchControl({
        provider: provider,
        style: 'bar',
        showMarker: false,
        searchLabel: 'Search Map',
        retainZoomLevel: true
      });
      this.map.addControl(search);
    }, 1000)

    //add current user marker. setout added because to user API if logged in
    setTimeout(() => {
      this.addMarker();
    }, 5000)

    this.map.on('zoomstart', (res) => {
      this.prevZoom = this.map.getZoom();
    })
    //on zoom level changed show but btns and set zoom
    this.map.on('zoomend', (res) => {
      // if(!Capacitor.isNativePlatform()){
      //   let currZoom = this.map.getZoom();
      //   let diff = this.prevZoom - currZoom;
      //   if(diff > 0){
      //     console.log('zoomed out');
      //     // if (currZoom < 8) {
      //     //   this.map.setZoom(5)
      //     // } else if (currZoom >= 8 && currZoom <= 11) {
      //     //   this.map.setZoom(10)
      //     // } else if (currZoom >= 12 && currZoom <= 15) {
      //     //   this.map.setZoom(15)
      //     // }
      //   } else if(diff < 0) {
      //     console.log('zoomed in');
      //     // if (currZoom < 8) {
      //     //   this.map.setZoom(5)
      //     // } else if (currZoom >= 8 && currZoom <= 11) {
      //     //   this.map.setZoom(10)
      //     // } else if (currZoom >= 12 && currZoom <= 15) {
      //     //   this.map.setZoom(15)
      //     // }          
      //   }
      // }

      //this.map.setZoomAround(this.map.getBounds().getNorthWest(), res.target._zoom)
      if (res.target._zoom == 15) {
        this.showBuyBtn = true;
      } else {
        this.showBuyBtn = false;
        if (this.tiles != undefined) {
          this.selectedBoxs = [];
          this.myBoxs = [];
          this.map.removeLayer(this.tiles);
          this.tiles = undefined;
        }
      }
      //if (Capacitor.isNativePlatform()) {
        if (res.target._zoom < 8) {
          this.map.setZoom(5)
        } else if (res.target._zoom >= 8 && res.target._zoom <= 11) {
          this.map.setZoom(10)
        } else if (res.target._zoom >= 12 && res.target._zoom <= 15) {
          this.map.setZoom(15)
        }
      //}
    });

    //on map moved update marker location
    this.map.on("moveend", (e) => {
      // if (this.myMarker) {
      //   this.myMarker.slideTo(this.map.getCenter(), { duration: 100 });
      //   this.emitLocation(this.map.getCenter())
      // }
    });
  }

  async getCurrentLocation() {
    if (this.tiles != undefined) {
      this.map.removeLayer(this.tiles);
    }
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    this.map.flyTo([coordinates.coords.latitude, coordinates.coords.longitude], 15);
    this.myMarker.slideTo({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude }, { duration: 100 });
    if (GlobaldataService.userObject != undefined) {
      this.emitLocation({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude })
    }
  }

  async addMarker() {
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    if (GlobaldataService.userObject != undefined) {
      this.avatar = GlobaldataService.userObject.user_image;
    } else {
      this.avatar = 'https://api.flatmeta.io/assets/uploads/users/noimage.png'
    }
    const icon = Leaflet.divIcon({
      iconSize: [50, 50],
      popupAnchor: [13, 0],
      className: 'icon-div',
      html: `
        <div class="myIcon">
          <img src="${this.avatar}">
        </div>
      `
    });

    let name = GlobaldataService.userObject != undefined ? GlobaldataService.userObject.fullname : ''

    let customPopup = name == '' ?
      `
        <p>Hello, Guest!<p>
        <p>Please Signup to Continue!<p>
      `
      :
      `
        <p>Hello, ${name}<p>
        <p>Buy or Sell Any place you like!</p>
      `;

    // specify popup options 
    let customOptions = {
      'maxWidth': '400',
      'width': '200',
      'className': 'popupCustomMy',
    }
    if (this.myMarker != undefined) {
      this.map.removeLayer(this.myMarker);
    }
    this.myMarker = new DriftMarker([coordinates.coords.latitude, coordinates.coords.longitude], {
      draggable: true,  
      icon: icon
    })//@ts-ignore
      .bindPopup(customPopup, customOptions).addTo(this.map);

    const onMapClick = (e) => {
      this.myMarker.slideTo(e.latlng, { duration: 1500 });
      this.emitLocation(e.latlng)
      // Update marker on changing it's position
    }
    this.map.on('click', onMapClick);
  }

  getMapUser() {
    if (GlobaldataService.userObject != undefined) {
      this.http.post2('GetAllUser', { user_id: GlobaldataService.userObject.user_id }, false).subscribe((res: any) => {
        if (res.status == true) {
          this.otherUsers = res.data.users;
        }
      }, (e) => {
        console.log(e)
      })
    }
  }

  addOtherMarkers(data) {
    if (GlobaldataService.userObject != undefined && GlobaldataService.userObject.user_id != data.userId && this.otherUsers.length > 0) {

      let user = this.otherUsers.find(item => item.id == data.userId);
      user = { ...user, latLng: data.location };

      const icon = Leaflet.divIcon({
        iconSize: [50, 50],
        popupAnchor: [13, 0],
        className: 'icon-div',
        html: `
          <div class="myIcon">
            <img src="${user.image}">
          </div>
        `
      });

      let customPopup = this.addCustomPopup(user);

      // specify popup options 
      let customOptions = {
        'maxWidth': '400',
        'width': '200',
        'className': 'popupCustomOther',
        'iconId': user.id
      }

      if (this.otherMarkers.length > 0) {
        this.otherMarkers.forEach((marker) => {
          if (marker._popup.options.iconId == user.id) {
            marker.slideTo(user.latLng, { duration: 1500 });
          } else {
            let marker = new DriftMarker([user.latLng.lat, user.latLng.lng], {
              draggable: false,
              icon: icon,
            })//@ts-ignore
              .bindPopup(customPopup, customOptions).addTo(this.map);
            this.otherMarkers.push(marker);
          }
        })
      } else {
        let marker = new DriftMarker([user.latLng.lat, user.latLng.lng], {
          draggable: false,
          icon: icon,
        })//@ts-ignore
          .bindPopup(customPopup, customOptions).addTo(this.map);

        this.otherMarkers.push(marker);
      }
    }
  }

  addCustomPopup(user) {

    const im = this.renderer.createElement('img');
    this.renderer.addClass(im, 'popImgClass');
    this.renderer.setAttribute(im, "src", user.image);

    const p1 = this.renderer.createElement('p');
    const p1Text = this.renderer.createText(`${user.fullname}`);
    this.renderer.appendChild(p1, p1Text);

    const mDiv = this.renderer.createElement('div');
    this.renderer.setAttribute(mDiv, 'class', 'flex mdiv');

    this.renderer.appendChild(mDiv, im);
    this.renderer.appendChild(mDiv, p1);


    const p2 = this.renderer.createElement('p');
    const p2Text = this.renderer.createText(`Lat: ${user.latLng.lat} \n Lng: ${user.latLng.lng}`);
    this.renderer.appendChild(p2, p2Text);

    const sendMessageBtn = this.renderer.createElement('ion-button');
    const button1Text = this.renderer.createText('Message');
    sendMessageBtn.size = 'small';
    sendMessageBtn.mode = 'ios';
    sendMessageBtn.fill = 'outline';
    sendMessageBtn.expand = 'block';
    sendMessageBtn.onclick = () => {
      if (GlobaldataService.userObject != undefined) {
        this.showChat(user.id, user.fullname);
      } else {
        this.general.presentToast('Please login to continue!')
      }
    };


    const rptBtn = this.renderer.createElement('ion-button');
    const rptBtnText = this.renderer.createText('Report / Block');
    rptBtn.size = 'small';
    rptBtn.mode = 'ios';
    rptBtn.color = 'danger';
    rptBtn.fill = 'outline';
    rptBtn.expand = 'block';
    rptBtn.onclick = () => {
      this.toReportUser = user;
      this.reportPopover = true;
    };

    this.renderer.appendChild(sendMessageBtn, button1Text);
    this.renderer.appendChild(rptBtn, rptBtnText)

    const sendRequestBtn = this.renderer.createElement('ion-button');
    const button2Text = this.renderer.createText('Send Request');
    sendRequestBtn.size = 'small';
    sendRequestBtn.mode = 'ios';
    sendRequestBtn.fill = 'outline';
    sendRequestBtn.expand = 'block'

    sendRequestBtn.onclick = () => {
      this.sendRequest(user.id)
    };
    this.renderer.appendChild(sendRequestBtn, button2Text);

    const d1 = this.renderer.createElement('div');

    if (user.friends == true) {
      this.renderer.appendChild(d1, sendMessageBtn);
      this.renderer.appendChild(d1, rptBtn); // report user btn
      this.renderer.setAttribute(d1, 'class', 'flex justify-content-center');
    } else {
      this.renderer.appendChild(d1, sendRequestBtn);
    }

    const container = this.renderer.createElement('div');
    //this.renderer.appendChild(container, im);
    this.renderer.appendChild(container, mDiv);
    this.renderer.appendChild(container, p2);
    this.renderer.appendChild(container, d1);

    return container;
  }

  setGrid(m) {
    let that = this;
    this.tiles = new Leaflet.GridLayer({
      tileSize: 40,
      opacity: 0.8,
      updateWhenZooming: false,
      updateWhenIdle: false,
      minNativeZoom: 10,
      maxNativeZoom: 15,
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
      let sb = undefined; //sold box
      sb = that.soldBoxes.find(e => nw.lat == e.lat && nw.lng == e.lng);
      if (sb != undefined) {
        let mb = undefined; //my box
        mb = that.soldBoxes.find(e => nw.lat == e.lat && nw.lng == e.lng && e.user_id == (GlobaldataService.userObject != undefined ? GlobaldataService.userObject.user_id : null));
        if (mb != undefined) {
          if (mb.image != '') {
            let im = new Image();
            im.src = mb.image;
            setTimeout(() => {
              ctx.drawImage(im, 0, 0, 40, 40);
            }, 250)
            ctx.strokeStyle = 'transparent';
          } else {
            ctx.strokeStyle = 'green'; // if my box
          }
          tile.id = mb.order_id;
          that.myTiles.push(tile);
        } else {
          let ob = that.soldBoxes.find(e => nw.lat == e.lat && nw.lng == e.lng && e.user_id !== (GlobaldataService.userObject != undefined ? GlobaldataService.userObject.user_id : null));
          if (ob != undefined) {
            if (ob.image != '') {
              let im = new Image();
              im.src = ob.image;
              setTimeout(() => {
                ctx.drawImage(im, 0, 0, 40, 40);
              }, 250)
              ctx.strokeStyle = 'transparent';
            } else {
              ctx.strokeStyle = 'red'; // if other user box
            }
          }
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
          let mb = [];
          mb = that.soldBoxes.filter(d => cb.order_id == d.order_id && d.user_id == (GlobaldataService.userObject != undefined ? GlobaldataService.userObject.user_id : null));
          if (mb.length > 0) { // checking if box i bought by me
            that.qEditor = cb.custom_details;
            if (that.myBoxs.length > 0) {
              if (that.myBoxs[0].order_id == mb[0].order_id) {
                that.myTiles.forEach((v) => {
                  v.classList.remove('my-box');
                });
              } else {
                that.myTiles.forEach((v) => {
                  if (v.id == mb[0].order_id) {
                    v.classList.add('my-box');
                  } else {
                    v.classList.remove('my-box');
                  }
                });
              }
            } else {
              that.myTiles.forEach((v) => {
                if (v.id == mb[0].order_id) {
                  v.classList.add('my-box');
                } else {
                  v.classList.remove('my-box');
                }
              });
            }
            if (that.myBoxs.length > 0 && that.myBoxs[0].order_id == mb[0].order_id) {
              that.myBoxs = [];
            } else {
              that.myBoxs = mb;
            }
          } else {
            let pop = undefined;
            pop = that.soldBoxes.find(d => nw.lat == d.lat && nw.lng == d.lng);
            const Micon = Leaflet.icon({
              iconUrl: 'https://www.flatmeta.io/API/assets/img/map-icon.png',
              iconSize: [20, 20], // size of the icon
              popupAnchor: [13, 0],
            });

            let userData = `
            <div class="flex" style="align-items: center;">
              <div>
                <img src="${pop.image}" style="width: 50px; height: 50px; border-radius: 50%;"/>
              </div>
              <div style="padding-left: 10px; font-weight:bold">
                ${pop.fullname}
              </div>
            </div>
            `
            let customPopup = userData + pop.custom_details;
            // specify popup options 
            let customOptions = {
              'maxWidth': '400',
              'width': '200',
              'className': 'popupCustom',
            }
            let marker = undefined;
            marker = Leaflet.marker([nw.lat, nw.lng], { icon: Micon });
            marker.bindPopup(customPopup, customOptions).addTo(m);
            setTimeout(() => {
              marker.fire('click');
            })
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
            that.selectedBoxs.push({ lat: nw.lat, lng: nw.lng });
          }
        }
      });
      return tile;
    }
    this.tiles.addTo(m);

  }

  removeSelectedBoxes() {
    this.map.removeLayer(this.tiles);
    this.imgSelection = false;
    this.selectedImg = '';
    this.selectedBoxs = [];
    this.myBoxs = [];
    this.tiles = undefined;
    this.showUplaodedImage = false;
    setTimeout(() => {
      this.setGrid(this.map);
    }, 250)
  }

  ngOnDestroy() {
    this.map.remove();
  }

  getBoxImgs() {
    this.http.get2('BoxImages', false).subscribe((res: any) => {
      if (res.status == true) {
        this.boxImgs = res.data.images;
        this.boxImgs2 = res.data.images;
      }
    }, (e) => {
      console.log(e)
    })
  }

  confirmImg() {
    let imgObj = {
      order_id: this.myBoxs[0].order_id,
      image: this.selectedImg.name
    }
    this.http.post('UpdateBoxImage', imgObj, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.getSoldBox();
        this.general.presentToast('Boxes bought successfully!');
        this.map.removeLayer(this.tiles);
        this.imgSelection = false;
        this.selectedImg = '';
        this.soldBoxes = [];
        this.selectedBoxs = [];
        this.myBoxs = [];
        this.tiles = undefined;
        this.showUplaodedImage = false;
        setTimeout(() => {
          this.setGrid(this.map);
        }, 2000)
      }
    }, (e) => {
      console.log(e)
    })

  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  choosePhoto = async (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        this.http.uploadImages(e.target.files[i], 'UploadBoxesImage').subscribe((res: any) => {
          if (res.status == true) {
            this.boxImgs.push(res.data);
            this.selectedImg = res.data;
            this.showUplaodedImage = true;
            this.general.presentToast('Image Uploaded!')
          } else {
            this.general.presentToast(res.data.message);
          }
        })
      }
    }
  }

  addToCart() {
    if (GlobaldataService.userObject == undefined) {
      this.general.presentToast('Please Login to Continue!')
      return
    }
    let t = [];
    this.selectedBoxs.map((e) => {
      t.push({ lat: e.lat.toString(), lng: e.lng.toString() })
    })
    let save = {
      tiles: t,
    };
    this.http.post('AddToCart', save, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.getSoldBox();
        this.general.presentToast(res.data.message);
        this.map.removeLayer(this.tiles);
        this.soldBoxes = [];
        this.selectedBoxs = [];
        this.tiles = undefined;
        setTimeout(() => {
          this.setGrid(this.map);
        }, 2000)
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

  editorSubmit() {
    let data = {
      order_id: this.myBoxs[0].order_id,
      custom_details: this.qEditor
    }
    this.http.post('UpdateCustomDetails', data, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.getSoldBox();
        this.general.presentToast('Boxes Updated successfully!');
        this.map.removeLayer(this.tiles);
        this.imgSelection = false;
        this.selectedImg = '';
        this.soldBoxes = [];
        this.selectedBoxs = [];
        this.myBoxs = [];
        this.tiles = undefined;
        this.showEditor = false;
        setTimeout(() => {
          this.setGrid(this.map);
        }, 2000)
      }
    }, (e) => {
      console.log(e)
    })
  }

  async showChat(id, name) {
    const modal = await this.modalController.create({
      component: ChatComponent,
      mode: 'ios',
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { id: id, name: name }
    });
    return await modal.present();
  }

  sendRequest(id) {
    this.http.post('SendFriendRequest', { follower_user_id: id }, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.general.presentToast(res.data.message)
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }

  getEmitLocation() {
    let observable = new Observable(observer => {
      this.socket.on('emitLocation', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  emitLocation(latLng) {
    if (GlobaldataService.userObject != undefined) {
      this.socket.emit("emitLocation", { userId: GlobaldataService.userObject.user_id, location: latLng });
    }
  }

  initializeItems(): void {
    this.boxImgs = this.boxImgs2;
  }

  searchIcon(evt) {
    this.initializeItems();
    const searchTerm = evt.detail.value;
    if (!searchTerm) {
      return;
    }
    this.boxImgs = this.boxImgs2.filter(currentSer => {
      if (currentSer.country && searchTerm) {
        if (currentSer.country.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getReportList() {
    this.http.get('GetAllReportText', false).subscribe((res: any) => {
      if (res.status == true) {
        this.reportList = res.data.reports;
      }
    }, (e) => {
      console.log(e)
    })
  }

  reportUser(id) {
    let rpt = {
      user_id: this.toReportUser.id,
      report_id: id,
      report_text: ''
    };

    this.http.post('AddUserReport', rpt, true).subscribe((res: any) => {
      this.general.stopLoading();
      if (res.status == true) {
        this.reportPopover = false;
        this.toReportUser = undefined;
        this.general.presentToast(res.data.message);
      }
    }, (e) => {
      this.general.stopLoading();
      console.log(e)
    })
  }


}