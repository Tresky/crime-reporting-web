'use strict';

app.factory('Crimes', function($http, $q) {

  var Crime = function(initData) {
    var C = {};
    angular.extend(C, initData);

    // M.sdsd = function.....
    return C;
  };

  var Crimes = {};
  Crimes.getById = function(id) {

  };

  Crimes.getWhere = function(params) {
    return $http.get('/api/crimes', { params: params })
      .then(function(data) {
        return _.map(data.data, function(d) {
          return new Crime(d);
        });
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  };

  Crimes.initWithData = function(initData) {
    return new Crime(initData);
  };

  return Crimes;
});
