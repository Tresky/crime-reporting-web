'use strict'

var db = require('../models/sequelize');

exports.index = function(req, res) {
  if (req.user) {
    var results = [];

    db.Notification.findAll({
     where: { userId: req.user.id, viewedAt: null }
    })
      .then(function(notif) {
        res.send(notif);
      }, function(response) {
        console.log('Failed to query for notifications', response);
        res.send(null);
      });
  } else {
    res.status(403).end();
  }
};

exports.show = function(req, res){
  db.Notification.findById(req.params.id)
    .then(function(notif){
       res.send(notif)
    }, function(response) {
      console.log('Failed to query notification', req.params.id, response);
      res.send(null);
    });
};


exports.create = function(req, res) {
  var data = {
    regionalId: req.body.regionalId,
    userId: req.body.userId,
    crimeId: req.body.crimeId
  };

  db.Notification.create(data)
   .then(function(newNotif) {
     console.log('Created a new Notification', newNotif);
     res.send(newNotif);
   }, function(response) {
     console.log('Failed to make new Notification', response);
     res.send(response);
   });
};

exports.view = function(req, res) {
  if (req.user) {
    db.Notification.findAll({
     where: { userId: req.user.id }
   }).then(function(notif) {
     notif.forEach(function(n) {
       n.update({
         viewedAt: (new Date).toISOString()
       }).then(function() {
       });
     });
   }, function(response) {
     console.log('Couldn\'t fetch notifications', response);
   });
  } else {
    res.status(403).end();
  }
};
