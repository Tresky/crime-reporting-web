var request = require('supertest');
var Crime = require('../../../controllers/crime.js');
var app = require('../../../app.js');
var db = require('../../../models/sequelize');
var moment = require('moment');

describe('Crime Controller', function(){

	describe('#index', function(){




	});

	describe('#show', function(){
 
		var id = null;
		beforeEach(function(){
			return db.Crime.create({
				crimeType: 'sexual',
				longitude: 5.3,
				latitude: 3.6,
				dateOfCrime: moment().format(),
				email: 'dummy@test.com'

			})

			.then(function(crime){
				global.crime0 = crime;
			}, function(response) {
				console.log('Failes to create user object for testing');
			});
			

		});

		/*afterEach(function(){
			return db.Crime.clear();
		});*/

		it('returns 200', function(done){
			console.log(id);
			request(app)
				.get('/api/crime/' + id)
				.expect(200, done);
		});
	});	

	describe('#create', function(){




	});

	describe('#update', function(){




	});

	describe('#destroy', function(){




	});

});