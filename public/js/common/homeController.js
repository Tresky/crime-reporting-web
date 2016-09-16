'use strict';

app.controller('HomeController', ['$scope', '$location', 'baLocation',
	function($scope, $location, baLocation) {
    console.log('Loading Home Controller');

    $scope.state = {
      location: null,
      geohash: null,
      q: {
        geolocationEnabled: baLocation.geolocationEnabled
      }
    };

    console.log('PositionEnabled', baLocation.geolocationEnabled());

    $scope.setCurrentPosition = function() {
      baLocation.fetchPosition()
        .then(function(loc) {
          console.log('Current Position', loc);
          $scope.state.location = loc;
        }, function(response) {
          console.log('Failed to Fetch Position', response);
        });
    };

    // $scope.fetchPosition = function() {
    //   baLocation.fetchPosition()
    //     .then(function(loc) {
    //       console.log('Current Position', loc);
    //       $scope.state.location = loc;
    //     }, function(response) {
    //       console.log('Failed to Fetch Position', response);
    //     });
    // };
}]);
