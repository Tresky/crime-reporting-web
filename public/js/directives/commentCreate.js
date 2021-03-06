'use strict';

app.directive('commentCreate', function(Comments) {
  return {
    templateUrl: 'js/directives/templates/commentCreate.html',
    restrict: 'A',
    scope: {
      crime: '=commentCreate'
    },
    link: function(scope, elem) {
      scope.state = {
        message: ''
      };

      scope.submitComment = function() {
        Comments.create({
          message: scope.state.message,
          userId: 0,
          crimeId: scope.crime.id
        }).then(function(newComment) {
          scope.$emit('comment:createSuccess');
          scope.state.message = '';
        }, function(response) {
          console.error('Failed to make new Comment', response);
        });
      };

    },
    controller: function() {

    }
  };
});
