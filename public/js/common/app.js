'use strict';

var app = angular.module('beaware', [
  'ngAnimate', 'vModal', 'angularMoment', 'ngRoute', 'ui.bootstrap'
])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'views/home.html', controller: 'HomeCtrl'})
                  .when('/crimes', {templateUrl: 'views/crime-list.html', controller: 'CrimeListCtrl'})
                  .when('/report', {templateUrl: 'views/report-crime.html', controller: 'ReportCrimeCtrl'});
  }])
  .run(['notificationService', function(notificationService) {

  }]);

// app.config(['$httpProvider', function(httpProvider) {
// 	httpProvider.defaults.xsrfHeaderName = '_csrf';
// 	httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
// }]);
