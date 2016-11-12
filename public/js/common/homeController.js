'use strict';

app.controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'baLocation', 'baLibraryStore', 'baDataService',
	function($scope, $rootScope, $location, $timeout, baLocation, baLibraryStore, baDataService) {
    $scope.state = {
      placeId: null,
      geohash: null,
      q: {
        geolocationEnabled: baLocation.geolocationEnabled
      }
    };

		// Instances of the two Google objects on the page: input box
		// and the Google search box attached to it that autocompletes addresses.
		$scope.inputBox = undefined;
		$scope.searchBox = undefined;

		/**
		 * Initializes the home controller functionalities to be
		 * useable. This relies on first loading the Google Places API.
		 */
		function initialize() {
			console.log('Initializing Home Controller');
			// Make sure the Google Places API is loaded before continueing.
			baLibraryStore.load('googleplaces')
				.then(function() {
					console.log('Loaded Google Places');
					initAutocomplete();

					// This is called just to get the current position in the cache.
					// Allows the request to move quicker if the user clicks the
					// 'current position' button.
					// console.log('TYLER');
					// baLocation.fetchPosition();
				}, function(response) {
					console.log('Failed to load the Google Places API.', response);
				});
    }

		/**
		 * Initializes the autocomplete box using the Google Places API.
		 * This will allow the user to enter an address and have it
		 * translated into a Google Place ID for us to store.
		 */
		function initAutocomplete() {
			console.log('Initializing Autocomplete Box');
			// Create the search box and link it to the UI element.
			$scope.inputBox = document.getElementById('pac-input');
			$scope.searchBox = new google.maps.places.SearchBox($scope.inputBox);

			$scope.searchBox.addListener('places_changed', function() {
				var place = $scope.searchBox.getPlaces()[0];
				var time = moment.utc().valueOf();

				baLocation.setExplicitPosition({
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng(),
					timeFetched: time
				});
				// console.log('Positionm', place);
				// baLocation.geocodeCoordinates({
				// 	latitude: place.geometry.location.lat(),
				// 	longitude: place.geometry.location.lng()
				// })
				// 	.then(function(geocode) {
				// 		console.log('GEOCODE', geocode);
				// 	});
				// baDataService.setCurrentLocation($scope.searchBox.getPlaces()[0]);
				$scope.$apply(function() { $location.path('/crimes'); });
			});
		}

		/**
		 * Fetches the current location of the computer via the browser
		 * and save it for later. This will be used if the user clicks
		 * on the icon near the text box.
		 */
		var setCurrentPosition = function() {
			baLocation.fetchPositionGeocode()
				.then(function(geocode) {
					$('#pac-input').val(geocode.formatted_address);
					baLocation.setExplicitPositionWithCurrent();
					$timeout(function() { $location.path('/crimes'); }, 100);
				});
		}

		// Expose this function to the $scope
    $scope.setCurrentPosition = setCurrentPosition;

		// Initialize the controller
		initialize();
}]);
