'use strict';

let Parser    = require ('./Parser.js').Parser;
let Customers = require ('./Customers.js').Customers;
let View      = require ('./View.js').View;

class Control {
	constructor () {
		this.customers = new Customers ();

		Parser.load ((data)=>{
			this.check (data);
		}).then (()=>{ this.finish (); }, (err)=>{
			View.error (err);
		});
	}

	check (data) {
		if (!data){
			View.error ("data not loaded");
			return false;
		}

		this.customers.check (data);
	}

	finish () {
		var results = {
			invalid_customers: this.customers.invalidData
		};

		View.outputResults (results);
	}
}

module.exports.Control = Control;
