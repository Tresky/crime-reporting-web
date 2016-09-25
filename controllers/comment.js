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
exports.index = function(req, res){
  //params  come from req.params
  //
  //Before you query, you need to validate
  // the parameters on req.params. Make sure they are defined
  //and that they are acceptable fields: crimeType, latitude, etc.
  //
  //Query with:
  db.Comment.findAll({
   where: req.params
  });
}


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
      CONSOLE. LOG('failed to fetch crime row:', req.params.id, response);
      res.send(null);
    });
};

//create a new row bassed on paramenters that we pass in
exports.create= function(req, res){
  //Validate the parameters ust as in #index.
  //create with

  var result = null;
  db.Crime.create(req.params)
   .then(function(createdObj) {
     //success case
     res.send(comment);
   }, function(response) {
     //failing connectAssets//print error with the response object
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
