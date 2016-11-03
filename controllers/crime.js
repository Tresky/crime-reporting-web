'use strict';

var db = require('../models/sequelize');


// return an array of rows the from table that mtaches the query
exports.index = function(req, res){

	//query with:
	//before you query, you need to validate the paremets on req.params. make sure trhey are acdceptable fiels like crimeType, lattitude.
	//db.Crime.findAll(){
	// where: req.params
	// };

};


exports.show = function(req, res) {

	db.Crime.findById(req.params.id)
		.then(function(crime) {
			res.send(crime);
		}, function(response) {

			console.log('Failed to fetch crime row:', req.params.id, response);
			res.send(null);
		});

};

//
exports.create = function(req, res) {
	// validate params eg. index
//create with db.Crime.create(req.params);
// .then(function(createObj){
//
//
//})
//return the oject that was created.

	db.Crime.create(req.params)

		.then(function(createObj) {
			res.send(crime);
		}, function(response){

			//failing case
			res.send(response);
		});
};


exports.update = function(req, res){
	//validate the paramets as above
	db.Crime.update(req.params, {
		where:{
			id: req.params.id
		}
	})
		.then(function(crimes){

			res.send(crimes);

		}, function (response){
			//PRINT THE ERROR AND RESPONSE OBJECT AND THEN
			res.send(response);
		});



};


exports.destroy = function(req, res){

	db.Crime.destroy({

		where: {
			id: req.params.id
		}
	})
		.then(function(numberOfDestroyed){
			res.send(numberOfDestroyed);
		}, function(response) {
			//print the error and response object and then
			res.send(response);
		});

};
