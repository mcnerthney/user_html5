angular.module( 'ngZoute.signup', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngResource',
  'ngStorage'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'signup', {
    url: '/signup',
    views: {
      "main": {
        controller: 'SignupCtrl',
        templateUrl: 'signup/signup.tpl.html'
      }
    },
    data:{ pageTitle: 'Signup' }
  });
})

.controller( 'SignupCtrl', [ '$scope', 'User', '$location', function SignupCtrl( $scope, User, $location ) {
    
    $scope.input = {};
    
    $scope.submit = function() 
    {
        $scope.busy = true;
        User.register($scope.input.email, $scope.input.password).then(
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
    
  $scope.dropdownDemoItems = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];
}])

;
