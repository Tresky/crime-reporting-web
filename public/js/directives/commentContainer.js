'use strict';

app.directive('commentContainer', function(Comments) {
  return {
    template: '<div class="comment-container"><div class="header">Comments</div><div comment="comment" class="comment-box" ng-repeat="comment in state.comments"></div><div comment-create="crime"></div></div>',
    restrict: 'A',
    scope: {
      crime: '=commentContainer'
    },
    link: function(scope, elem) {
      scope.state = {
        comments: null
      };


      function fetchCrimes() {
        Comments.getByCrimeId(scope.crime.id)
        .then(function(comments) {
          scope.state.comments = comments;
        }, function(response) {
          console.error('Failed to load comments for crime', scope.crime.id);
        });
      }

      scope.$on('comment:createSuccess', fetchCrimes);
      fetchCrimes();

    },
    controller: function() {

    }
  };
});
