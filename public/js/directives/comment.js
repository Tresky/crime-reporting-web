'use strict';

app.directive('comment', function() {
  return {
    templateUrl: 'js/directives/templates/comment.html',
    restrict: 'A',
    scope: {
      comment: '='
    },
    link: function(scope, elem) {
      scope.comment._createdAt = moment(scope.comment.createdAt);
    },
    controller: function() {

    }
  };
});
