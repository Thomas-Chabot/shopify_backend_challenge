'use strict';

let Validity  = require ('./Validity.js').Validity;

class Customers {
	constructor () {
		this.validity = null;
		this.invalid  = [ ];
	}

	check (data) {
		if (!data) return false;

		if (!this.validity)
			this.validity = new Validity (data.validations);


		var customers = data.customers;
		for (let index in customers){
			var check = this.validity.check (customers [index]);
			if (!check.valid)
				this.invalid.push ({
					id: customers [index].id,
					invalid_fields: check.invalidFields
				});
		}
	}

	get invalidData () {
		return this.invalid;
	}
}

module.exports.Customers = Customers;