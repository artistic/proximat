import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, PopoverController, ViewController, AlertController } from 'ionic-angular';


import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { Auth } from '../../providers/auth';
import firebase from 'firebase';



@Component({
  selector: 'page-vehicle',
  templateUrl: 'vehicle.html'
})
export class VehiclePage {

	vehicle:FirebaseListObservable<any>;
  locations:FirebaseListObservable<any>;
	private displayUser : string;
  vehicles:FirebaseListObservable<any>;

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
  	)
  {
    this.locations = ngFire.database.list("/locations");
    this.displayUser = firebase.auth().currentUser.uid;    
    this.vehicles = ngFire.database.list(`/userData/${this.displayUser}/vehicles`);
    console.log (this.displayUser);
    this.vehicle = ngFire.database.list("/vehicle");
   }
//wait sorry that error comes when you try add on the booking page
// Whereis the vehicls page
// we are currently on the vehicles page but that add vehicle is on both and the one on booking is not working let me remove it

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
                    user : this.displayUser
                   })
              }
           }
          ]
      })
      prompt.present();
  }





}
