'use strict';

app.controller('ReportCrimeCtrl', ['$scope', '$rootScope', '$timeout', '$location', 'baLocation', 'baLibraryStore', 'Crimes',
	function($scope, $rootScope, $timeout, $location, baLocation, baLibraryStore, Crimes) {
    $scope.state = {
      location: null,
      geohash: null,
      doneInitializing: false,
			datepicker: {
				value: new Date(),
				opened: false,
				options: {
			    formatYear: 'yy',
			    maxDate: moment.utc(),
			    minDate: moment.utc().subtract(30, 'days'),
			    startingDay: 1
			  }
			},
			dropdown: {
				value: null,
				opened: false,
				types: [
					'Assault',
					'Murder',
					'Stealing',
					'Clown-Sighting'
				]
			},
      q: {
        geolocationEnabled: baLocation.geolocationEnabled,
        doneInitializing: function() { return $scope.state.doneInitializing; }
      }
    };

		// Instances of the four Google objects on the page: input box
		// and the Google search box attached to it that autocompletes addresses.
		// Also, the map itself and the marker on the map.
		$scope.inputBox = undefined;
		$scope.searchBox = undefined;
    $scope.map = undefined;
    $scope.marker = undefined;

		/**
		 * Initializes the home controller functionalities to be
		 * useable. This relies on first loading the Google Places API.
		 */
		function initialize() {
			console.log('Initializing Home Controller');

      $scope.state.doneInitializing = false;
			// Make sure the Google Places API is loaded before continueing.
			baLibraryStore.load('googleplaces')
				.then(function() {
					console.log('Loaded Google Places');

          initAutocomplete();
          initializePosition();
				}, function(response) {
					console.log('Failed to load the Google Places API.', response);
				});
    }

    /**
     * Fetches the current explicit position from the location service.
     * If no explicit location is set, the current GPS position will be used.
     */
    function initializePosition() {
      console.log('Initializing Position');

      baLocation.fetchExplicitPositionGeocode()
        .then(function(geocode) {
					$scope.state.location = {
						lat: geocode.geometry.location.lat(),
						lng: geocode.geometry.location.lng(),
						placeId: geocode.place_id,
						timeFetched: moment.utc().valueOf()
					};
					$scope.state.address = geocode.formatted_address;

          // Create the Google map on the page
          $scope.map = new google.maps.Map(document.getElementById('report-map'), {
            zoom: 11,
            center: {
							lat: $scope.state.location.lat,
							lng: $scope.state.location.lng
						}
          });

					$timeout(function() {
						google.maps.event.trigger($scope.map, 'resize');
		        $scope.map.panTo({
							lat: $scope.state.location.lat,
							lng: $scope.state.location.lng
						});

						// A marker will be added to where you click
						$scope.marker && $scope.marker.setMap(null);
						$scope.marker = new google.maps.Marker({
							position: { lat: $scope.state.location.lat, lng: $scope.state.location.lng },
							map: $scope.map
						});

						$('#pac-input').val(geocode.formatted_address);

						// Attach a click listen to the map. This allows you to set your
						// location by clicking on the map.
	          $scope.map.addListener('click', function(event) {
	            $scope.state.location = {
	              lat: event.latLng.lat(),
	              lng: event.latLng.lng(),
	              timeFetched: moment.utc().valueOf()
	            };

							// A marker will be added to where you click
	            $scope.marker && $scope.marker.setMap(null);
	            $scope.marker = new google.maps.Marker({
	              position: { lat: $scope.state.location.lat, lng: $scope.state.location.lng },
	              map: $scope.map
	            });

							// The map will pan to where you click
	            $scope.map.panTo($scope.marker.getPosition());

							// Current position will be set respectively
	            baLocation.geocodeCoordinates($scope.state.location)
	              .then(function(geocode) {
	                $scope.state.geocode = geocode;
	                $('#pac-input').val($scope.state.geocode.formatted_address);
									$scope.state.location.placeId = $scope.state.geocode.place_id;
									$scope.state.address = geocode.formatted_address;
	              });
						});
          }, 0);

          $scope.state.doneInitializing = true;
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

				$scope.state.address = place.formatted_address;

				$scope.state.location = {
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng(),
					placeId: place.place_id,
					timeFetched: moment.utc().valueOf()
				};

				baLocation.setExplicitPosition({
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng(),
					timeFetched: time
				});

        $scope.marker && $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
          map: $scope.map
        });

        $scope.map.panTo($scope.marker.getPosition());

				// $scope.$apply(function() { $location.path('/crimes'); });
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
					$scope.state.address = geocode.formatted_address;
					$('#pac-input').val(geocode.formatted_address);
					baLocation.setExplicitPositionWithCurrent()
            .then(function(location) {
							$scope.location = {
								lat: location.lat,
								lng: location.lng,
								placeId: geocode.place_id,
								timeFetched: moment.utc().valueOf()
							};

              $scope.marker && $scope.marker.setMap(null);
              $scope.marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: $scope.map
              });

              $scope.map.panTo($scope.marker.getPosition());
            }, function(response) {
              console.log('Failed to set explicit position', response);
            });
				});
		};

		// Expose this function to the $scope
    $scope.setCurrentPosition = setCurrentPosition;

		$scope.submit = function() {
			var data = {
				crimeType: $scope.state.dropdown.value.toLowerCase(),
				placeId: $scope.state.location.placeId,
				address: $scope.state.address,
				latitude: $scope.state.location.lat,
				longitude: $scope.state.location.lng,
				dateOfCrime: $scope.state.datepicker.value,
				userId: 0,
				email: ''
			};

			Crimes.create({
				crimeType: $scope.state.dropdown.value.toLowerCase(),
				placeId: $scope.state.location.placeId,
				address: $scope.state.address,
				latitude: $scope.state.location.lat,
				longitude: $scope.state.location.lng,
				dateOfCrime: $scope.state.datepicker.value,
				userId: 0,
				email: ''
			}).then(function(crime) {
					console.log('Created New Crime', crime);
					$location.path('/crimes');
				}, function(response) {
					console.log('Failed to create new crime', response);
				});
		};

		// Initialize the controller
		initialize();
}]);
