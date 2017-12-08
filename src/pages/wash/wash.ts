import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, PopoverController, ViewController, AlertController } from 'ionic-angular';
import firebase from 'firebase';


import { AngularFire,FirebaseListObservable } from 'angularfire2';



@Component({
  selector: 'page-wash',
  templateUrl: 'wash.html'
})
export class WashPage {
	washInfo: any;
	services:FirebaseListObservable<any>;


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
  	this.services = ngFire.database.list("/services");
  	this.washInfo = navParams.data; //here you'll get the data you passed from your home.ts
  }







}
