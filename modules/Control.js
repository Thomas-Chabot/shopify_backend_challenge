'use strict';

let Parser    = require ('./Parser.js').Parser;
let Customers = require ('./Customers.js').Customers;

class Control {
	constructor () {
		this.customers = new Customers ();

		Parser.load ((data)=>{
			this.check (data);
		}).then (()=>{ this.finish (); }, (err)=>{
			console.error (err);
		});
	}

	check (data) {
		if (!data){
			console.error ("-- ERROR: DATA DID NOT LOAD --");
			return false;
		}

		this.customers.check (data);
	}

	finish () {
		var results = {
			invalid_customers: this.customers.invalidData
		};

		console.log (JSON.stringify (results, null, 2));
	}
}

module.exports.Control = Control;