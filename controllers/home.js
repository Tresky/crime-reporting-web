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

exports.app = function(req, res) {
  res.render('app', {
    title: 'Application'
  });
}

exports.crimeList = function(req, res) {
  res.render('crime-list', {
    title: 'Crime List',
    params: 'Tyler'
  });
};
