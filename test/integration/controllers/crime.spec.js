var request = require('supertest');
// var expect = require('Chai').expect;
var Crime = require('../../../controllers/crime.js');
var app = require('../../../app.js');
var Sequalize = require('sequelize');
var db = require('../../../models/sequelize');

var moment = require('moment');
var _ = require('lodash');

var crime0 = null;

describe('Crime Controller', function() {
  describe('#index', function() {

    beforeEach(function() {
      var promises = [];

      _.concat(promises, db.Crime.create({
        crimeType: 'sexual',
        placeId: 'EioyNzc3IENoYWRkc2ZvcmQgQ2lyLCBPdmllZG8sIEZMIDMyNzY1LCBVU0E',
        latitude: '28.620097',
        longitude: '-81.2497558',
        dateOfCrime: moment().format(),
        email: 'dummy@test.com'
      })
        .then(function(crime) {
          global.crime0 = crime;
        })
      );

      _.concat(promises, db.Crime.create({
        crimeType: 'murder',
        placeId: 'ChIJX0kKal1o54gRq5vHs5Kb1V8',
        latitude: '28.6024274',
        longitude: '-81.2000599',
        dateOfCrime: moment().format(),
        email: 'dummy@test.com'
      })
        .then(function(crime) {
          global.crime1 = crime;
        })
      );

      Promise.all(promises).then(function() {
        done();
      });
    });

    afterEach(function() {
      db.Crime.destroy({ where: {} }).then(function() {});
    });

    it('return 200', function(done) {
      var options = {
        url: 'http://localhost:3000/api/crimes',
        params: {
          placeId: 'EioyNzc3IENoYWRkc2ZvcmQgQ2lyLCBPdmllZG8sIEZMIDMyNzY1LCBVU0E'
        }
      };
      request(app)
        .get('/api/crimes')
        .send({
          latitude: '28.620097',
          longitude: '-81.2497558',
          radius: 1000
        })
        .expect(200)
        .end(function(err, res, body) {
          if (err) {
            console.error('Error:', err);
            return done(err);
          }

          console.log('Result:', body);

          done();
        });
    })
  });

  describe('#show', function() {

    // Crime:
    //   id
    //   crimeType => 'sexual' | 'violent' | 'theft' | 'vandalism'
    //   longitude
    //   latitude
    //   dateOfCrime
    //   userId
    //   email => if userId === null -> email must be defined
    //
    //   updatedAt
    //   createdAt

    // Must return the promise object when doing hooks with promises
    // beforeEach(function() {
    //   return db.Crime.create({
    //     crimeType: 'sexual',
    //     longitude: 5.3,
    //     latitude: 3.6,
    //     dateOfCrime: moment().format(),
    //     email: 'dummy@test.com'
    //   })
    //     .then(function(crime) {
    //       global.crime0 = crime;
    //     }, function(response) {
    //       console.log('Failed to create user object for testing');
    //     });
    // });
    //
    // afterEach(function() {
    //   // return db.Crime.clear();
    // });
    //
    // it('returns 200', function(done) {
    //   console.log('ID', global.crime0);
    //   request(app)
    //     .get('/api/crime/' + global.crime0.id)
    //     .expect(200, done);
    // });
  });

  describe('#create', function() {

  });

  describe('#update', function() {

  });

  describe('#destroy', function() {

  });
});
