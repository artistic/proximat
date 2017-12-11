import { Component } from "@angular/core";
import { NavController, NavParams, MenuController } from "ionic-angular";
import * as Leaflet from "leaflet";
import { GeofenceService } from "../../services/geofence-service";
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { Camera } from 'ionic-native';
import { Auth } from '../../providers/auth';
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
  private EndDate: string ;
  private notificationPicture: string;
  private transitionType: string;
  private circle: any;
  private marker: any;
  private map: any;
  locations: FirebaseListObservable<any>;
  vehicles:  FirebaseListObservable<any>;
  bookings:  FirebaseListObservable<any>;
  public hazardTypes:any;
  public VehicleMake:any;
  public selectedVehicleMake:any;
  public selectedHazardType:any;
  public imageLocalURL:any;
  public uploadedImage:any = "";
  private displayUser : string;



  constructor(
    private nav: NavController,
    navParams: NavParams,
    private geofenceService: GeofenceService,
    private menu: MenuController,
    public ngFire: AngularFire
  ) {

    this.displayUser = firebase.auth().currentUser.uid;
    console.log (this.displayUser);

    this.bookings = ngFire.database.list(`/userData/${this.displayUser}/bookings`);

    this.locations = ngFire.database.list("/locations");
    this.vehicles = ngFire.database.list("/vehicle");

    this.geofenceService = geofenceService;
    this.geofence = navParams.get("geofence");
    this.transitionType = this.geofence.transitionType.toString();
    this.notificationText = this.geofence.notification.text;
    this.StartDate = this.geofence.notification.start;
    this.EndDate = this.geofence.notification.end;
    this._radius = this.geofence.radius;
    this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);


  this.hazardTypes = [

      {name:"Wash N Go",imgURL:"washings.jpg",cat:"1"},
      {name:"Vacuums",imgURL:"vacuums.jpg",cat:"1"},
      {name:"Jumbo",imgURL:"jumbos.jpg",cat:"1"},
      {name:"Tyres",imgURL:"wheels.jpg",cat:"1"}
  ];




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
    setTimeout(this.loadMap.bind(this), 10);
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
    var now = new Date();
    now.setDate(now.getDate());

    console.log(now);

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
    geofence.wash_details.user = this.displayUser;


    console.log(geofence);

    this.geofenceService.addOrUpdate(geofence).then(() => {
      location.reload();
      this.nav.pop();
      // this.locations.push(geofence);
    });

    //add data to bookings

      this.bookings.push ({
        booking_date: this.StartDate,
        wash_text: this.this.notificationText,
        wash_image: this."assets/img/"+this.hazardTypes[this.selectedHazardType].imgURL
       });
  }


}
