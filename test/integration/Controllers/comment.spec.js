var request = require('supertest');
var Comment = require('../../../controllers/comment.js');
var app = require('../../../app.js');
var db = require('../../../models/sequelize');

//var moment = require('moment');
//moment().format

var comment0 = null

//Describe test
describe('Comment Controller', function(){
  describe('#index', function(){

  });
  describe('#show', function(){

    // Must return the promise object when doing hooks with promises
    beforeEach(function() {
      return db.Comment.create({
        message: 'this crime was wack',
        userId: 1
      })
      .then(function(crime) {
        global.comment0 = crime;
      }, function(response){
        console.log('Failed to create user object for testing')
      });
    });

    // afterEach(function(){
    //   return clear funciton    //  ****FIND THIS OUT
    // })


    it('returns 200', function(done){
      request(app)
        .get('/api/comment/1')
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
