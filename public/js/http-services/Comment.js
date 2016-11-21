'use strict';

app.factory('Comments', function($http, $q) {

  var Comment = function(initData) {
    var C = {};
    angular.extend(C, initData);

    return C;
  };

  var Comments = {};
  Comments.getById = function(id) {

  };

  Comments.getByCrimeId = function(crimeId) {
    return $http.get('/api/comments', { params: { crimeId: crimeId } })
      .then(function(data) {
        return _.map(data.data, function(d) {
          return new Comment(d);
        });
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  };

  Comments.create = function(data) {
    return $http.post('/api/comments', data)
      .then(function(data) {
        return new Comment(data);
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
