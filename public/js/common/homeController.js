'use strict';

app.controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'baLocation', 'baLibraryStore',
	function($scope, $rootScope, $location, $timeout, baLocation, baLibraryStore) {
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
				
				$scope.$apply(function() { $location.path('/crimes'); });
			});
		}

		/**
		 * Fetches the current location of the computer via the browser
		 * and save it for later. This will be used if the user clicks
		 * on the icon near the text box.
		 */
		var setCurrentPosition = function() {
			$scope.state.fetchingPosition = true;
			baLocation.fetchPositionGeocode()
				.then(function(geocode) {
					$('#pac-input').val(geocode.formatted_address);
					baLocation.setExplicitPositionWithCurrent();
					$timeout(function() { $location.path('/crimes'); }, 100);
					$scope.state.fetchingPosition = false;
				});
		};

		// Expose this function to the $scope
    $scope.setCurrentPosition = setCurrentPosition;

		// Takes you to the Report Crime page
		$scope.report = function() {
			$location.path('/report');
		};

		// Initialize the controller
		initialize();
}]);
