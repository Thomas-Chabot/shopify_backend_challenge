/*
	The purpose of this class is to load the API and grab the validity data.

	Has one static function:
		.load (each)
			Purpose: Loads the data for all customers from the API.
			Arguments:
				each  FUNCTION  A function to be called for every page loaded.
				                Will be given one argument, the data for the page
				                ( see https://backend-challenge-winter-2017.herokuapp.com/
				                  for details )
			Returns: Promise. Resolved after all customer data is loaded.

	NOTE: This makes use of the request Node library to load requests:
		https://www.npmjs.com/package/request
*/
'use strict';

var request = require ("request");

let apiBase = 'https://backend-challenge-winter-2017.herokuapp.com/customers.json';

let _getMaxPageIndex = function (pageData) {
	if (!pageData){
		console.error ("-- Page Data not provided. Returning -1 --");
		return -1;
	}
	
	let perPage = pageData.per_page;
	let total   = pageData.total;

	return Math.ceil (total / perPage);
}

let _load = function (curPageIndex, maxPageIndex, eachFunc) {
	return new Promise (function (fulfill, reject){
		if (maxPageIndex >= 0 && curPageIndex > maxPageIndex) fulfill();
		else{
			request (apiBase + "?page=" + curPageIndex, function (err, resp, body){
				if (err) reject (err);
				else{
					var data;
					try{
						data = JSON.parse (body);
					} catch (err) {
						reject (err);
					}

					// if we don't have it yet, get the max page number
					if (maxPageIndex < 0)
						maxPageIndex = _getMaxPageIndex (data.pagination);

					// run the each function ...
					eachFunc (data);

					// and load our next page
					_load (curPageIndex + 1, maxPageIndex, eachFunc).then (fulfill, reject);
				}
			});
		}
	});
}

class Parser {
	static load (each) {
		return _load (1, -1, each);
	}
}

module.exports.Parser = Parser;