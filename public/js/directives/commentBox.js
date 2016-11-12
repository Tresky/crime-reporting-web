'use strict';

app.directive('commentBox', function() {
  return {
    templateUrl: 'js/directives/templates/commentBox.html',
    restrict: 'A',
    scope: {
      crime: '=commentBox'
    },
    link: function(scope, elem) {
      scope.state = {
        message: ''
      };
    },
    controller: function() {

    }
  };
});
