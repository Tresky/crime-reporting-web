'use strict';

var db = require('../models/sequelize');
var geolib = require('geolib');
var _ = require('lodash');
var googlemaps = require('googlemaps');
var gmaps = new googlemaps({
	key: 'AIzaSyAu_I-8fBuC3d_UrovCDMCswAfWmuF-iYE',
	encode_polylines: false,
	secure: true
});

// Return an array of rows the from table that matches the query
exports.index = function(req, res) {
	// Never ever just grab all elements from the database,
	// but time is limited for this project. A more effective
	// solution would be to create a 'regions' table that contains
	// links to all of the crime records within "Central Florida"
	// or other regions. This will allow you to cut down the data
	// that you need to analyze from a million to a few hundred.
	//
	// But since this is a time sensitive school project, this will
	// have to do...
	var results = [];

	db.Crime.findAll()
		.then(function(crimes) {
			results = _.filter(_.map(crimes, 'dataValues'), function(crime) {

				// Check if the crime is within the searchable radius
				return geolib.isPointInCircle(
					{ latitude: parseFloat(crime.latitude), longitude: parseFloat(crime.longitude) },
					{ latitude: parseFloat(req.query.latitude), longitude: parseFloat(req.query.longitude) },
					req.query.radius
				);
			});

			res.send(results);
		});
};


exports.show = function(req, res) {
	db.Crime.findById(req.body.id)
		.then(function(crime) {
			res.send(crime);
		}, function(response) {

			console.log('Failed to fetch crime row:', req.body.id, response);
			res.send(null);
		});
};

exports.create = function(req, res) {
	var data = {
		crimeType: req.body.crimeType,
		placeId: req.body.placeId,
		address: req.body.address,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		dateOfCrime: req.body.dateOfCrime,
		userId: req.body.userId,
		email: req.body.email
	};

	db.Crime.create(data)
		.then(function(crime) {
			res.send(crime);
		}, function(response){
			console.log('Error:', response);
			res.send(response);
		});
};

exports.update = function(req, res) {
	db.Crime.update(req.params, {
		where:{
			id: req.params.id
		}
	}).then(function(crimes){
			res.send(crimes);
		}, function (response){
			res.send(response);
		});
};

exports.destroy = function(req, res) {
	db.Crime.destroy({
		where: {
			id: req.params.id
		}
	}).then(function(numberOfDestroyed){
			res.send(numberOfDestroyed);
		}, function(response) {
			res.send(response);
		});

};
