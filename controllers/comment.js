'use strict'
// squelize documentation:
var db = require('../models/sequelize');

//CRUD
//Create Read Update Delete


/** Returns an array of rows from the table that matches the
* query parameters that we give it
*
*params ={
*  crimeType: 'sexual'
*}
*
*/

//
exports.index = function(req, res) {
  //params  come from req.params
  //
  //Before you query, you need to validate
  // the parameters on req.params. Make sure they are defined
  //and that they are acceptable fields: crimeType, latitude, etc.
  //
  //Query with:

  var results = [];

  db.Comment.findAll({
   where: { crimeId: req.query.crimeId }
  })
    .then(function(comments) {
      console.log('RESULTS', comments);

      res.send(comments);
    }, function(response) {
      console.log('Failed to query for comments', response);
      res.send(null);
    });
};


//Retuns a single row based on the ID passed in
//
//params ={
//  id: 23
//}
//

exports.show= function(req, res){
  //user id that we want
  //req.params.id

  db.Comment.findById(req.params.id)
    .then(function(comment){
       res.send(comment)
    }, function(response) {
      console.log('failed to fetch crime row:', req.params.id, response);
      res.send(null);
    });
};


exports.create = function(req, res) {  
  var data = {
    message: req.body.message,
    crimeId: req.body.crimeId,
    userId: req.body.userId
  };

  db.Comment.create(data)
   .then(function(newComment) {
     console.log('Created a new Comment', newComment);
     res.send(newComment);
   }, function(response) {
     console.log('Failed to make new Comment', response);
     res.send(response);
   });

};

//Update an existing rowbased on parameters that we pass in
exports.update= function(req, res){
  db.Comment.update(req.params, {
    where: {
      id: req.params.id
    }
  })
  .then(function(comments) {
    res.send(comments);
  }, function(response) {
    //print the erros and response object and then
    res.send(response);
  });
};

//destroys a row based on Id
exports.destroy= function(req, res){
//Destroy with:
  db.Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function(comments) {
      res.send(numberOfDestroyed);
    }, function(response) {
      //print the error and response object and then
      res.send(response);
    });
};
