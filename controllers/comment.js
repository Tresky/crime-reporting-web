'use strict'

var db = require('../models/sequelize');

exports.index = function(req, res) {
  var results = [];

  db.Comment.findAll({
   where: { crimeId: req.query.crimeId }
  })
    .then(function(comments) {
      res.send(comments);
    }, function(response) {
      console.log('Failed to query for comments', response);
      res.send(null);
    });
};

exports.show= function(req, res){
  db.Comment.findById(req.params.id)
    .then(function(comment){
       res.send(comment)
    }, function(response) {
      console.log('Failed to query for comment', req.params.id, response);
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

exports.update = function(req, res){
  db.Comment.update(req.params, {
    where: {
      id: req.params.id
    }
  })
  .then(function(comments) {
    res.send(comments);
  }, function(response) {
    console.log('Failed to update comment', response);
    res.send(response);
  });
};

exports.destroy = function(req, res){
  db.Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function(comment) {
      res.send(comment);
    }, function(response) {
      console.log('Failed to destry comment', response);
      res.send(response);
    });
};
