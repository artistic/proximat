import { Component } from "@angular/core";
import { NavController, NavParams, MenuController } from "ionic-angular";
import * as Leaflet from "leaflet";
import { GeofenceService } from "../../services/geofence-service";
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { Camera } from 'ionic-native';
import firebase from 'firebase';

const cameraOpts = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      targetWidth:720,
      correctOrientation: true,
      allowEdit: true,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
}

const cameraOpts2 = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      targetWidth:720,
      correctOrientation: true,

}

@Component({
  templateUrl: "geofence-details.html"
})
export class GeofenceDetailsPage {
  private geofence: Geofence;
  private _radius: number;
  private _latLng: any;
  private notificationText: string;
  private StartDate: string;
  private EndDate: string;
  private notificationPicture: string;
  private transitionType: string;
  private circle: any;
  private marker: any;
  private map: any;
  locations: FirebaseListObservable<any>;
  public hazardTypes:any;
  public selectedHazardType:any;
  public imageLocalURL:any;
  public uploadedImage:any = "";


  constructor(
    private nav: NavController,
    navParams: NavParams,
    private geofenceService: GeofenceService,
    private menu: MenuController,
    public ngFire: AngularFire


  ) {
    this.locations = ngFire.database.list("/locations");
    this.geofenceService = geofenceService;
    this.geofence = navParams.get("geofence");
    this.transitionType = this.geofence.transitionType.toString();
    this.notificationText = this.geofence.notification.text;
    this.StartDate = this.geofence.notification.start;
    this.EndDate = this.geofence.notification.end;
    this._radius = this.geofence.radius;
    this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);


  this.hazardTypes = [

      {name:"Corrosive Hazard",imgURL:"corrosive.png",cat:"1"},
      {name:"Confined Space",imgURL:"confined_space.png",cat:"1"},
      {name:"Critical Zone",imgURL:"Critical_Zone.png",cat:"1"},
      {name:"Electrical Hazard",imgURL:"Electrical_Hazard.png",cat:"2"},
      {name:"Excavator At Work (HME)",imgURL:"excavator.png",cat:"3"},
      {name:"Extreme Hail",imgURL:"Extreme_Hail.png",cat:"4"},
      {name:"Extreme Heat ",imgURL:"Extreme_Heat.png",cat:"4"},
      {name:"Extreme Noise",imgURL:"noise.png",cat:"1"},
      {name:"Extreme Rain",imgURL:"Extreme_Rain.png",cat:"4"},
      {name:"Extreme Wind",imgURL:"Extreme_Wind.png",cat:"4"},
      {name:"Flammable Material",imgURL:"flammable.png",cat:"1"},
      {name:"Flooding Of Roadway",imgURL:"Flooding_of_Roadway.png",cat:"1"},
      {name:"Hazardous Gas",imgURL:"Hazardous_Gas.png",cat:"1"},
      {name:"Hazardous Liquid",imgURL:"Hazardous_Liquid.png",cat:"1"},
      {name:"Heavy Vehicle",imgURL:"haulage.png",cat:"3"},
      {name:"Light Vehicle",imgURL:"lv.png",cat:"3"},
      {name:"Low Temperature",imgURL:"low_temperature.png",cat:"1"},
      {name:"Low Visibility",imgURL:"Low_Visibilty.png",cat:"1"},
      {name:"Open Hazard",imgURL:"Open_Ground.png",cat:"1"},
      {name:"Other Hazard",imgURL:"other.png",cat:"1"},
      {name:"Person",imgURL:"Person.png",cat:"3"},
      {name:"Public Unrest",imgURL:"Public_Unrest.png",cat:"1"},
      {name:"Radiation",imgURL:"radiation.png",cat:"1"},
      {name:"Roadway Flooded",imgURL:"Flooding_of_Roadway.png",cat:"1"},
      {name:"Slippery Floor/Ground",imgURL:"slippery_ground.png",cat:"1"},
      {name:"Slippery Roadway",imgURL:"slippery_roadway.png",cat:"1"},
      {name:"Spillage",imgURL:"Spillage.png",cat:"1"},
      {name:"Toxic Substance",imgURL:"Toxic_Substance.png",cat:"1"},
      {name:"Uneven Ground",imgURL:"Uneven_Ground.png",cat:"1"},
      {name:"Vehicle Breakdown",imgURL:"Vehicle_Breakdown.png",cat:"1"},
      {name:"Wild Animal",imgURL:"Wild_Animal.png",cat:"1"},
      {name:"Workers Above",imgURL:"Workers_Above.png",cat:"1"},


    ]


  }

  get radius() {
    return this._radius;
  }



  set radius(value) {
    this._radius = value;
    this.circle.setRadius(value);
  }

  set latLng(value) {
    this._latLng = value;
    this.circle.setLatLng(value);
    this.marker.setLatLng(value);
  }

  get latLng() {
    return this._latLng;
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    // workaround map is not correctly displayed
    // maybe this should be done in some other event
    setTimeout(this.loadMap.bind(this), 100);
    console.log(this.geofence)
  }

  loadMap() {
    this.map = Leaflet
      .map("map2")
      .setView(this.latLng, 13)
      .on("click", this.onMapClicked.bind(this))

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);

    this.marker = Leaflet
      .marker(this.latLng, { draggable: true })
      .on("dragend", this.onMarkerPositionChanged.bind(this))
      .addTo(this.map);

    this.circle = Leaflet.circle(this.latLng, this.radius).addTo(this.map);
  }

  onMapClicked(e) {
    this.latLng = e.latlng;
  }

  onMarkerPositionChanged(e) {
    const latlng = e.target.getLatLng();

    this.latLng = latlng;
  }




takePic() {
  let storageRef = firebase.storage().ref();
  console.log(storageRef)
  Camera.getPicture(cameraOpts).then((image) => {

      this.imageLocalURL = 'data:image/jpeg;base64,' + image;
    }).catch(err => {
      alert(err);
    });
}

takePic2() {
  let storageRef = firebase.storage().ref();
  console.log(storageRef)
  Camera.getPicture(cameraOpts2).then((image) => {

      this.imageLocalURL = 'data:image/jpeg;base64,' + image;
    }).catch(err => {
      alert(err);
    });
}

uploadPic() {
  let storageRef = firebase.storage().ref();
  const filename = Math.floor(Date.now() / 1000);
  const imageRef = storageRef.child(`images/${filename}.jpg`);

  imageRef.putString(this.imageLocalURL, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {

    console.log(snapshot);
     this.uploadedImage = snapshot.downloadURL; //update the variable
     alert("Image Uploaded Successfully")
    })
    .catch(err =>{
        console.log(err);
      alert(imageRef)
    });
}



saveChanges() {
    const geofence = this.geofence;

    geofence.notification.text = this.notificationText;
    geofence.radius = this.radius;
    geofence.latitude = this.latLng.lat;
    geofence.longitude = this.latLng.lng;
    geofence.transitionType = parseInt(this.transitionType, 10);
    geofence.notification.data = "assets/img/"+this.hazardTypes[this.selectedHazardType].imgURL;
    geofence.notification.picture = this.uploadedImage;
    geofence.notification.start = this.StartDate;
    geofence.notification.end = this.EndDate;




    console.log(geofence);

    this.geofenceService.addOrUpdate(geofence).then(() => {
      location.reload();
      this.nav.pop();


      // this.locations.push(geofence);

    });
  }

}
