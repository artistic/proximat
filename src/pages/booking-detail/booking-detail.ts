import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, PopoverController, ViewController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

import { TipsPage } from '../tips/tips';
import { BookingsPage } from '../bookings/bookings';
import { AngularFire,FirebaseListObservable } from 'angularfire2';



@Component({
  selector: 'page-bookingdetail',
  templateUrl: 'booking-detail.html'
})
export class BookingDetailPage {
	bookingInfo: any;



  constructor(
  	public navCtrl: NavController,
		   public navParams: NavParams,
		    private menu: MenuController,
		    public platform:Platform,
		    public popoverCtrl: PopoverController,
		    public alertCtrl: AlertController,
		    private nav: NavController,
		    public viewCtrl: ViewController,
		    public ngFire: AngularFire,
  ){

  	this.bookingInfo = navParams.data; //here you'll get the data you passed from your home.ts
  }











}
