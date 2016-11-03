"use strict";

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.crimeList = function(req, res) {
  res.render('crime-list', {
    title: 'Crime List',
    params: 'Tyler'
  });
};
