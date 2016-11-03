'use strict';

app.controller('HomeController', ['$scope', '$location', 'baLocation', 'baLibraryStore',
	function($scope, $location, baLocation, baLibraryStore) {
    console.log('Loading Home Controller');

    $scope.state = {
      location: null,
      geohash: null,
      q: {
        geolocationEnabled: baLocation.geolocationEnabled
      }
    };

		// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAu_I-8fBuC3d_UrovCDMCswAfWmuF-iYE&libraries=places" async defer></script>

		function initAutocomplete() {
			// console.log('BEFORE', google.maps);
			baLibraryStore.load('googleplaces')
				.then(function() {
					var input = document.getElementById('pac-input');
					// console.log('AFTER', google.maps);
		      var searchBox = new google.maps.places.SearchBox(input);
				});

      // Create the search box and link it to the UI element.


      // searchBox.addListen('places_changed', function() {
      //   var places = searchBox.getPlaces();
      // });
    }

		initAutocomplete();

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
