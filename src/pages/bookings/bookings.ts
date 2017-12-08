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

        this.locations = ngFire.database.list("/locations");
        this.vehicles = ngFire.database.list("/vehicle");

        this.displayUser = firebase.auth();
        console.log (this.displayUser.uid);

        this.res = this.userDataRef = ngFire.database.list("userData", {
          query:{
            orderByKey: '$key',
            equalTo: this.displayUser.uid
          }
        }).subscribe((res)=>{
          console.log(this.res)
        })

        console.log('From Log', this.res)
        
   
        
        // Can you try hitting Ctrl + Space after the this. above
    // Not triggering suggestions for some reason can i download a plugin or something 
    // The suggestion are built in

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


    addVehicle():void {
      let prompt = this.alertCtrl.create ({
          title : 'Add A Vehicle',

          inputs: [
            { name : 'make', placeholder: "Make" },
            { name : 'plates', placeholder: "Plates" },
          ],
          buttons: [
           {
              text: "Cancel",
              //handler : data => { console.log("cancel clicked");}
           },
           {
              text: "Create Vehicle",
              handler: data => {
                  this.vehicles.push ({
                    make: data.make,
                    plates: data.plates,
                    image : "assets/img/vehicle.png",
                    user : this.displayUser,
                   })
              }
           }
          ]
      })
      prompt.present();
  }



}
