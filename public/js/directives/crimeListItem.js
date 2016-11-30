'use strict';

app.directive('crimeListItem', function($location, baLocation) {
  return {
    templateUrl: 'js/directives/templates/crimeListItem.html',
    restrict: 'A',
    scope: {
      crimeListItem: '='
    },
    link: function(scope, elem) {
      scope._ = _;
      scope.state = {
        expand: false,
        geocode: null,
        crimeIcon: ''
      };

      console.log('Crime List Item', scope.crimeListItem);

      var type = scope.crimeListItem.crimeType;
      if (type == 'murder') {
        scope.state.crimeIcon = 'fa fa-times fa-3x';
      } else if (type == 'stealing') {
        scope.state.crimeIcon = 'fa fa-money fa-3x';
      } else if (type == 'assault') {
        scope.state.crimeIcon = 'fa fa-fire fa-3x';
      } else if (type == 'clown-sighting') {
        scope.state.crimeIcon = 'fa fa-smile-o fa-3x';
      }



      // scope.goToHome = function() {
        // $state.go('/', { crimeId: scope.crimeListItem.id });
        // $location.path('/crimes/' + scope.crimeListItem);
        // $window.location = '/crimes/:crimeId';
      // };
    },
    controller: function() {

    }
  };
});
