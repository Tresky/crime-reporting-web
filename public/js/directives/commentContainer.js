'use strict';

app.directive('commentContainer', function() {
  return {
    template: '<div class="comment-container"><div comment="comment" class="comment-box" ng-repeat="comment in state.comments"></div></div>',
    restrict: 'A',
    scope: {
      crime: '=commentContainer'
    },
    link: function(scope, elem) {
      scope.state = {
        state.comments: null
      };

      Comments.loadByCrimeId(scope.crime.id)
        .then(function(comments) {
          scope.state.comments = comments;
        }, function(response) {
          console.log('Failed to load comments for crime', scope.crime.id);
        });
    },
    controller: function() {

    }
  };
});
