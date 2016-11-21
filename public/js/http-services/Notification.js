'use strict';

app.factory('Notifications', function($http, $q) {

  var Notification = function(initData) {
    var C = {};
    angular.extend(C, initData);

    return C;
  };

  var Notifications = {};
  Notifications.getAll = function(crimeId) {
    return $http.get('/api/notifications')
      .then(function(data) {
        return _.map(data.data, function(d) {
          return new Notification(d);
        });
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  };

  Notifications.create = function(data) {
    return $http.post('/api/notifications', data)
      .then(function(data) {
        return new Notification(data);
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  };

  Notifications.markAllViewed = function() {
    return $http.post('/api/notifications_viewed')
      .then(function(result) {
        return true;
      }, function(response) {
        console.error('Error:', response);
        return $q.reject(response);
      });
  }

  Notifications.initWithData = function(initData) {
    return new Notification(initData);
  };

  return Notifications;
});
