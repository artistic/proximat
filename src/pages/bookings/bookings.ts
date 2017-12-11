import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, PopoverController, ViewController, AlertController } from 'ionic-angular';
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { Auth } from '../../providers/auth';
import firebase from 'firebase';
import * as Leaflet from "leaflet";
import { AuthPage } from '../auth/auth';
import { AllHazardsPage } from '../all-hazards/all-hazards';
import { BookingDetailPage } from '../booking-detail/booking-detail';
import { ServicesPage } from '../services/services';
import { FaqPage } from '../faq/faq';
import { ProfilePage } from '../profile/profile';
import { VehiclePage } from '../vehicle/vehicle';
import { AllHazardsPopoverPage } from '../all-hazards-popover/all-hazards-popover';
import { GeofenceListPage } from '../geofence-list/geofence-list';




@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html'
})
export class BookingsPage {
  displayUser:any;
  locations:FirebaseListObservable<any>;
  location:FirebaseListObservable<any>;
  vehicles:FirebaseListObservable<any>;
  bookings:FirebaseListObservable<any>;
  cat:string;
  user: any;
  userData:any;
  userDataRef:any;
  res:any;

  vehicle:FirebaseListObservable<any>;


  hazardTypes:any;

      constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private menu: MenuController,
        public ngFire: AngularFire,
        public platform:Platform,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController,
        public auth: Auth,
        public viewCtrl: ViewController,
      ){


        if(!this.isLoggedIn()){
            console.log('You are not logged in ');
            this.navCtrl.setRoot(AuthPage);
          }
        this.displayUser = firebase.auth().currentUser.uid;  
        this.locations = ngFire.database.list("/locations");
        this.bookings = ngFire.database.list(`/userData/${this.displayUser}/bookings`);

        // this.displayUser = firebase.auth().currentUser.uid;
        // can we contiue in a bit when I ge home? 
        // It seems currentuser is stored in memory...so if you load up the app on that page the value does not exist
        // until you enter a page it does exist and then go back into the page.

        // The solution would be to take the value from localstorage
        ///okay thanks a million 

       // this.vehicles = ngFire.database.list(`/userData/${this.displayUser}/vehicles`);
        
        //console.log (this.displayUser.uid);

        ngFire.database.object("userData/MS5SBt4JlcNPCTAawi5hxYGSCfK2").subscribe((a) => {
          this.res = a;
        })


        this.hazardTypes = [
          {name:"Wash N Go",imgURL:"washings.jpg"},
          {name:"Vacuum",imgURL:"vacuums.jpg"},
          {name:"Jumbo",imgURL:"jumbos.jpg"},
          {name:"Tyres",imgURL:"wheels.jpg"},

        ]


      }


      ionViewDidLoad() {
         this.cat = 'cars';

      }

      ionViewWillEnter(){


        }

      //  Auth Stuff
      isLoggedIn(){
        if(window.localStorage.getItem("user")){
          return true;
        }
      }


    goToServices() {
      this.navCtrl.push(ServicesPage);
    }

    goToFaq() {
      this.navCtrl.push(FaqPage);
    }

    goToProfile() {
    this.navCtrl.push(ProfilePage);
    }


    goToMap(){
    this.navCtrl.push(AllHazardsPage);
    }

    goToHazards(){
    this.navCtrl.push(GeofenceListPage);
  }


    goBookingDetail(location) {
      this.navCtrl.push(BookingDetailPage, location);
    }

    goVehicleDetail(vehicle) {
      this.navCtrl.push(VehiclePage, vehicle);
    }


    logOut(){
    window.localStorage.removeItem("user");
    this.navCtrl.setRoot(AuthPage)
    }





}
