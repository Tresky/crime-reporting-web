'use strict';

app.factory('Comments', function($http, $q) {

  var Comment = function(initData) {
    var C = {};
    angular.extend(C, initData);

    // M.sdsd = function.....
    return C;
  };

  var Comments = {};
  Comments.getById = function(id) {

  };

  Comments.getByCrimeId = function(params) {
    return $http.get('/api/comments', { params: params })
      .then(function(data) {
        return _.map(data.data, function(d) {
          return new Comment(d);
        });
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  };

  Comments.initWithData = function(initData) {
    return new Comment(initData);
  };

  return Comments;
});
