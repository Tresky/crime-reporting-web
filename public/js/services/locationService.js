'use strict';

app.service('baLocation', ['$q', function($q) {
    var location = {
      latitude: null,
      longitude: null,
      timeFetched: null,
    };

    var maxCacheAge = 60 * 5;
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

    var fetchPosition = function() {
      var deferred = $q.defer();

      if (state.q.cacheValid()) {
        deferred.resolve(location);
      } else if (!state.fetching && state.q.geolocationEnabled()) {
        state.fetching = true;
        navigator.geolocation.getCurrentPosition(function(position) {
          state.fetching = false;
          var time = moment.utc().valueOf();
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timeFetched: time
          };
          deferred.resolve(location);
        });
      }

      return deferred.promise;
    }

    var flushCache = function() {
      location = {
        latitude: null,
        longitude: null,
        timeFetched: null
      };
      state.fetching = false;
    }

    return {
      fetchPosition: fetchPosition,
      flushCache: flushCache,
      geolocationEnabled: state.q.geolocationEnabled
    };
}]);
