/*
	This handles the entirety of Validity checking.

	Documentation:
		constructor (criteria)
			Purpose: This constructs a new Validity object which can be used to check validity.
			Arguments:
				criteria  OBJECT  The Validations object. Requirements for this object are specified at
				                  https://backend-challenge-winter-2017.herokuapp.com/
			Returns: A new Validation object.
		check (user)
			Purpose: Checks if a given user is valid.
			Arguments:
				customer  OBJECT  A single customer object. This should match the customer definition within
				                  the API.
			Returns: An object containing two key-value pairs:
			           valid           BOOLEAN  Determination of the user's validity
			           invalidFields   ARRAY    An array of every field that failed the validation.
*/
'use strict';

let _parseCriteria = function (criteria){
	/*	- - - - THE EXAMPLE - - - - - -
		{
		  "validations": [
		    {
		      "name": {
		        "required": true,
		        "length": {
		          "min": 5,
		          "max": 20
		        }
		      }
		    },
		    {
		      "email": {
		        "required": true
		      }
		    },
		    {
		      "age": {
		        "type": "number"
		      }
		    },
		    {
		      "password": {
		        "required": true,
		        "length": {
		          "min": 8
		        }
		      }
		    }
		  ]
		}
		- - - - - - - - - - - - - - - -


		Which would mean, if we're parsing this:
			- Walk through the array
			- For each element in the array:
				Walk through every key, value pair. The key will be the name; value will be the criteria.
				There will be three criteria (possible):
					required:				boolean || DEFAULTS TO FALSE
					length: {
						min:				integer || DEFAULTS TO NO REQUIREMENT
						max:				integer || DEFAULTS TO NO REQUIREMENT
					}
					type:					string  || DEFAULTS TO NO REQUIREMENT
			- We should parse this into an array of:
				key: REQUIREMENTS
	*/

	let _parseDefaults = function (name, criterium) {
		// we apply the defaults here.
		// if required is not specified, it is false ;
		// length stays the same as what it is ;
		// type does not change ;
		// name should be added.

		criterium.required = criterium.required || false;
		criterium.name     = name;

		return criterium;
	}

	let results = [ ];
	for (let index in criteria) {
		for (let name in criteria [index]) {
			let values = criteria [index] [name];
			let defs   = _parseDefaults (name, values);
			results.push (defs);
		}
	};

	return results;
}

let _checkField = function (user, field) {
	// first check : does the user have the field?
	// if not and it's required, invalid ; else valid
	var prop = user [field.name];
	if (prop === undefined || prop === null)
		return !field.required;

	// does it match a specified type (if given) ?
	if (field.type && typeof prop !== field.type)
		return false;

	// now, if it doesn't have length requirement, it's good ...
	if (!field.length) return true;

	// otherwise check length is valid
	let length = prop.length;
	let reqd   = field.length;
	if (reqd.min && length < reqd.min) return false;
	if (reqd.max && length > reqd.max) return false;

	// at this point, there's no more checking, so it's valid
	return true;
}


// create the main Validity class
class Validity {
	constructor (criteria){
		this._criteria = _parseCriteria (criteria);
	}

	check (user){
		// walk through every criteria field & check
		let invalidFields = [ ];

		for (let index in this._criteria)
			if (!_checkField (user, this._criteria [index]))
				invalidFields.push (this._criteria [index].name);
		
		return {
			valid: invalidFields.length === 0,
			invalidFields: invalidFields
		};
	}
};



// export our class
module.exports.Validity = Validity;
