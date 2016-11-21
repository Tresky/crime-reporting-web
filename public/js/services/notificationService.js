'use strict';

app.service('notificationService', ['$q', '$interval', 'Notifications', function($q, $interval, Notifications) {
  var elementContainer = '.navbar .notif-badge';
  var interval = 300000; // 5 minutes

  function fetch() {
    console.log('Fetching Notifications...');
    Notifications.getAll()
      .then(function(notif) {
        var count = notif.length;
        $(elementContainer).text(count);
      });
  }

  fetch();
  $interval(fetch, interval);
}]);
