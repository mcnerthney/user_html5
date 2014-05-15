angular.module( 'ngZoute', [
  'templates-app',
  'templates-common',
  'ngZoute.home',
  'ngZoute.about',
  'ngZoute.signup',
  'ngZoute.login',
  'ui.router',
  'googlechart'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
    }
])

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Zoute' ;
    }
  });
})

;

