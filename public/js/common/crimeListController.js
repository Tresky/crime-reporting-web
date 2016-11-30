'use strict';

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('CrimeListCtrl', ['$scope', '$timeout', 'baLocation', 'Crimes', 'Notifications', function($scope, $timeout, baLocation, Crimes, Notifications) {
  $scope.state = {
    location: null,
    map: null,
    crimeList: [],
    // initialized: false,
    q: {
      doneInitializing: function() { return $scope.state.initialized; }
    }
  };

  initialize();

  /**
   * Initializes the controller's functionalities
   */
  function initialize() {
    console.log('Initializing Crime List Controller');
    Notifications.markAllViewed();
    // Intialize the position we are currently loading crimes for
    initializePosition(function() {
      $scope.state.initialized = true;

      // Create the Google map on the page
      $scope.state.map = new google.maps.Map(document.getElementById('list-map'), {
        zoom: 11,
        center: $scope.state.location
      });

      var cityCircle = new google.maps.Circle({
        strokeColor: '#77BBFF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#77BBFF',
        fillOpacity: 0.35,
        map: $scope.state.map,
        center: $scope.state.location,
        radius: 10000
      });

      $timeout(function() {
        google.maps.event.trigger($scope.state.map, 'resize');
        $scope.state.map.panTo($scope.state.location);
        // Create a map marker for each crime loaded in
        _.each($scope.state.crimeList, function(crime) {
          var m = new google.maps.Marker({
            position: { lat: parseFloat(crime.latitude), lng: parseFloat(crime.longitude) },
            map: $scope.state.map,
            title: crime.crime_type
          });
        });

      }, 0);
    });
  }

  /**
   * Fetches the current explicit position from the location service.
   * If no explicit location is set, the current GPS position will be used.
   * @param  {Function} cb Callback to be called whenever this is done
   */
  function initializePosition(cb) {
    console.log('Initializing Position');
    baLocation.fetchExplicitPosition()
      .then(function(loc) {
        $scope.state.location = loc;
        console.log('Current Location', $scope.state.location);

        queryCrimes(cb);
      });
  }

  /**
   * Queries for the crime records that are within a certain distance
   * of the current location being inspected.
   * @param  {Function} cb Callback to be called whenever this is done; used to setup map markers
   */
  function queryCrimes(cb) {
    console.log('Querying Crimes');
    Crimes.getWhere({
      latitude: $scope.state.location.lat,
      longitude: $scope.state.location.lng,
      radius: 10000
    }).then(function(crimes) {
      console.log('Crimes', crimes);
      $scope.state.crimeList = crimes;

      cb();
    });
  }
}]);
