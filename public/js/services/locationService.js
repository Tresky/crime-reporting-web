'use strict';

app.service('baLocation', ['$q', 'baLibraryStore', function($q, baLibraryStore) {
    var location = {
      lat: null,
      lng: null,
      timeFetched: null
    };
    var explicitLoc = null;

    var geocoder = null;

    var maxCacheAge = 60 * 5;
    var promiseQueue = [];
    var state = {
      fetching: false,
      q: {
        cacheValid: function() {
          return location.timeFetched && (moment.utc().valueOf() - location.timeFetched) > maxCacheAge;
        },
        geolocationEnabled: function() {
          return "geolocation" in navigator;
        }
      }
    };

    function initialize() {
      // Make sure the Google Places API is loaded before continueing.
      baLibraryStore.load('googleplaces')
        .then(function() {
          geocoder = new google.maps.Geocoder;

          // This is called just to get the current position in the cache.
          // Allows the request to move quicker if the user clicks the
          // 'current position' button.
          console.log('Initializing Position');
          fetchPosition();
        }, function(response) {
          console.log('Failed to load the Google Places API.', response);
        });
    }
    initialize();

    var geocodeCoordinates = function(loc) {
      var deferred = $q.defer();
      var latlng = null;

      // If a location is provided in the params, geocode that.
      if (loc) {
        latlng = loc;
      // If a location is not provided, attempt to use the cached value.
      } else if (state.q.cacheValid()) {
        latlng = location;
      } else {
        deferred.reject();
        return;
      }

      console.log('Geocoding Location', latlng, loc);

      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          deferred.resolve(results[0]);
        } else {
          deferred.reject(status);
        }
      });

      return deferred.promise;
    }

    var setExplicitPosition = function(loc) {
      explicitLoc = loc;
    };

    var setExplicitPositionWithCurrent = function() {
      fetchPosition()
        .then(function(loc) {
          explicitLoc = loc;
        }, function(response) {
          console.log('Failed to fetch position', response);
        });
    }

    var fetchPosition = function(skipCache) {
      console.log('Fetching Position');
      var deferred = $q.defer();

      if (!skipCache && state.q.cacheValid()) {
        deferred.resolve(location);
      } else if (state.q.geolocationEnabled() && state.fetching) {
        promiseQueue.push(deferred);
      } else if (state.q.geolocationEnabled() && !state.fetching) {
        state.fetching = true;
        promiseQueue.push(deferred);

        navigator.geolocation.getCurrentPosition(function(position) {
          state.fetching = false;
          var time = moment.utc().valueOf();
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timeFetched: time
          };

          _.forEach(promiseQueue, function(p) {
            console.log(' - Resolving Position');
            p.resolve(location);
          })
        });
      } else {
        console.log('Location is disabled');
        deferred.reject();
      }

      return deferred.promise;
    };

    var fetchPositionGeocode = function() {
      console.log('Fetching Location and Geocode');
      var deferred = $q.defer();

      fetchPosition()
        .then(function(position) {
          geocodeCoordinates(position)
            .then(function(geocode) {
              deferred.resolve(geocode);
            }, function(response) {
              deferred.reject(response);
            });
        }, function(response) {
          console.log('Failed to fetech position with geocode.');
          deferred.reject(response);
        });

      return deferred.promise;
    };

    var fetchExplicitPosition = function() {
      var deferred = $q.defer();

      console.log('CURRENT', explicitLoc);
      if (explicitLoc) {
        deferred.resolve(explicitLoc);
      } else {
        console.log('Explicit Location not set; using GPS location');
        fetchPosition()
          .then(function(loc) {
            explicitLoc = loc;
            deferred.resolve(explicitLoc);
          }, function(response) {
            deferred.reject(response);
          })
      }

      return deferred.promise;
    };

    var fetchExplicitPositionGeocode = function() {
      var deferred = $q.defer();

      geocodeCoordinates(explicitLoc)
        .then(function(geocode) {
          deferred.resolve(geocode);
        }, function(response) {
          console.log('Failed to geocode coordinates', response);
          deferred.reject(reject);
        });

      return deferred.promise;
    }

    var flushCache = function() {
      location = {
        lat: null,
        lng: null,
        timeFetched: null
      };
      state.fetching = false;
    }

    return {
      geocodeCoordinates: geocodeCoordinates,
      setExplicitPosition: setExplicitPosition,
      setExplicitPositionWithCurrent: setExplicitPositionWithCurrent,
      fetchPosition: fetchPosition,
      fetchPositionGeocode: fetchPositionGeocode,
      fetchExplicitPosition: fetchExplicitPosition,
      fetchExplicitPositionGeocode: fetchExplicitPositionGeocode,
      flushCache: flushCache,
      geolocationEnabled: state.q.geolocationEnabled
    };
}]);
