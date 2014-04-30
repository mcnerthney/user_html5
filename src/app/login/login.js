angular.module( 'ngZoute.login', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})

.controller( 'LoginCtrl', [ '$scope', 'User', '$location', function LoginCtrl( $scope, User, $location ) {
    
    $scope.input = {};
    
    $scope.submit = function() 
    {
        $scope.busy = true;
        User.login($scope.input.email, $scope.input.password).then(
          function success() {
              $scope.busy = false;
              $location.path('/hone');
          },
          function error(code) {
              $scope.busy = false;
              
              //$scope.error - Error.message(code);
          }
      );    
    };
}])
;
