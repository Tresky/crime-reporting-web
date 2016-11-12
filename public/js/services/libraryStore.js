'use strict';

app.service('baLibraryStore', ['$q', '$interval', function($q, $interval){
    var libraries = {
      'googleplaces': {
        name: "GooglePlaces",
        url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAu_I-8fBuC3d_UrovCDMCswAfWmuF-iYE&libraries=places",
        check: function() { return typeof google === 'object' && typeof google.maps === 'object'; },
        promiseQueue: []
      }
    };

    var load = function(libid) {
      var lib = libraries[libid];

      if (lib) {
        var deferred = $q.defer();
        var innerDeferred = $q.defer();

        // setup the function that will be executed after dependencies are loaded
        innerDeferred.promise.then(function() {
          if (lib.check()) {
            // lib has already been loaded... no need to inject it into the DOM again. Resolve.
            deferred.resolve(lib);

          } else if (lib._intvl) {
            // we're already trying to load this library... just wait
            lib.promiseQueue.push(deferred);

          } else {
            // the library is not installed and has not begun loading
            lib.promiseQueue.push(deferred);

            // check failed and there is no interval running
            var s = document.createElement('script');
            s.id = "LibraryStore-"+libid;
            s.src = lib.url;
            document.body.appendChild(s);

            var retriesLeft = 20;
            lib._intvl = $interval(function(){
              if (lib.check()) {
                $interval.cancel(lib._intvl);

                while (lib.promiseQueue.length > 0) {
                  lib.promiseQueue.shift().resolve(lib);
                }

              } else if (retriesLeft === 0) {
                Rollbar.warning('Timed out attempting to load ' + lib.name);
                $interval.cancel(lib._intvl);

                while (lib.promiseQueue.length > 0) {
                  lib.promiseQueue.shift().reject(lib);
                  $(s.id).remove();
                }
              }

              --retriesLeft;
            }, 25);
          }
        }, function() {
          Rollbar.warning('Unable to load dependencies for library ' + lib.name);
          deferred.reject();
        });

        // Check if there are any dependencies to load before attempting to load lib
        if (lib.depends && typeof(lib) == 'object') {

          // inspect which dependencies are currently not loaded
          var depsToLoad = _.where(lib.depends, function(d) {
            return !libraries[d].check();
          });

          if (depsToLoad.length > 0) {
            //console.log('depsToLoad', depsToLoad);

            $q.all(_.map(depsToLoad, function(dep) {
              return load(dep);
            })).then(function() {
              innerDeferred.resolve();
            }, function() {
              innerDeferred.reject();
            });
          } else {
            // no deps to load for lib, just resolve it now
            innerDeferred.resolve();
          }

        } else {
          // lib has no dependencies
          innerDeferred.resolve();
        }

        // return the promise for consumption by the caller
        return deferred.promise;
      }
    };

    return {
      load: load
    };
  }]);
