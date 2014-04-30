
angular.module( 'ngZoute.service', [
'ngStorage'
])


.factory('User', ['$http', '$localStorage', '$q', function($http, $localStorage, $q) {
    var self = this;
    
    var server = 'http://107.170.35.252';
    return {
        isActive: false,
        logout: function() {
            var deferred = $q.defer();
            var access = $localStorage.access;
            /* jshint -W024 */
            $http.delete( server + "/session?access=" + access  
                   ).success(function (data, status, headers, config) {
                       console.log(data);
                       self.isActive = false;
                       delete $localStorage.access;
                       deferred.resolve();
                   }).error(function (data, status, headers, config) {
                       deferred.reject(-1);
                   });
            
            return deferred.promise;
            
        },
        login: function(email, password ) {
            
            var deferred = $q.defer();
            
            $http.post( server + '/session', { email: email, password: password }
                   ).success(function (data, status, headers, config) {
                       console.log(data);
                       
                       if ( data.code === 0 )  {
                           self.isActive = false;
                           $localStorage.access = data.access;
                           deferred.resolve();
                           return;
                       }
                       
                       deferred.reject(data.code);
                       
                   }).error(function (data, status, headers, config) {
                       deferred.reject(-1);
                   });
                   
            return deferred.promise;
        },
                   
        profile: function() {
            
            var deferred = $q.defer();
            
            $http.get( server + '/user?access=' + $localStorage.access
                   ).success(function (data, status, headers, config) {
                       console.log(data);
                       
                       if ( data.code === 0 )  {
                           deferred.resolve(data);
                           return;
                       }
                       
                       deferred.reject(data.code);
                       
                   }).error(function (data, status, headers, config) {
                       deferred.reject(-1);
                   });
                   
            return deferred.promise;
            
        },
        register: function(email,password) {
            
            var deferred = $q.defer();
            
            $http.post( server + '/user', { email: email, password: password }
                   ).success(function (data, status, headers, config) {
                       console.log(data);
                       
                       if ( data.code === 0 )  {
                           self.isActive = false;
                           $localStorage.access = data.access;
                           deferred.resolve();
                           return;
                       }
                       
                       deferred.reject(data.code);
                       
                   }).error(function (data, status, headers, config) {
                       deferred.reject(-1);
                   });
                   
            return deferred.promise;
            
        }
    };
}]);


/**

var sessionServices = angular.module('ngZoute.service');
 
sessionServices.factory('session', ['$http', function($http) {
    return {
        logout: function() {
            
        },
        login: function() {
            
        }
    };
  }]);


 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngZoute.home', [
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
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', [ '$scope', '$location', '$localStorage', 'User', function HomeController( $scope, $location, $localStorage, User ) {
    
    User.profile().then(
       function success(data) {
           $scope.isActive = true;
           $scope.user = data.users[0];
       },
       function fail(data) {
           $scope.isActive = false;
           $scope.user = {};
       });
        
    $scope.submit = function() {
        
    };
    
   $scope.signup = function() {
       $location.path('signup');
   };
    
   $scope.login = function() {
       $location.path('login');
   };
   
    
   $scope.logout = function() {
       User.logout().then(
          function success(data) {
              $scope.isActive = false;
              $scope.user = {};
          },
          function fail(data) {
          });
   };
   
   
   
   
    
    
}]);

