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
        geocode: null
      };

      console.log('Crime List Item', scope.crimeListItem);

      scope.crimeListItem._dateOfCrime = moment(scope.crimeListItem.dateOfCrime);
      baLocation.geocodeCoordinates({
        lat: parseFloat(scope.crimeListItem.latitude),
        lng: parseFloat(scope.crimeListItem.longitude)
      }).then(function(geocode) {
        scope.state.geocode = geocode;
      });



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
