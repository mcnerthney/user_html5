angular.module( 'ngZoute.ticketType', [
  'ui.router',
  'ngZoute.service',
  'ngStorage'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/tickettype',
    views: {
      "main": {
        controller: 'TicketTypeCtrl',
        templateUrl: '/TicketType.tpl.html'
      }
    },
    data:{ pageTitle: 'TicketType' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'TicketTypeCtrl', [ '$scope', '$location', '$localStorage', 'User', function HomeController( $scope, $location, $localStorage, User ) {
    
    User.profile().then(
       function success(data) {
           $scope.isActive = true;
           $scope.user = data.users[0];
       },
       function fail(data) {
           $scope.isActive = false;
           $scope.user = {};
       });
           
    
    
}]);

