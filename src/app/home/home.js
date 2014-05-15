
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
            deferred.resolve({code: 0, users: [ { email: "agency@example.com" } ] } );
            
            return deferred.promise;
            /*
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
            */
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
.controller( 'HomeCtrl', [ '$rootScope','$scope', '$location', '$localStorage', 'User', 
    function HomeController( $rootScope, $scope, $location, $localStorage, User ) {
    
    User.profile().then(
       function success(data) {
           $scope.isActive = true;
           $scope.user = data.users[0];
       },
       function fail(data) {
           $scope.isActive = false;
           $scope.user = {};
       }) ;
       
    $scope.tabs = [
           {name:'Transactions'},
           {name:'Rider Meterics'},
           {name:'Transaction Meterics'},
           {name:'Ticket Types'}
    ];  
    $scope.activetab = "Transactions";
    
    $scope.tickets = [
       {id: '1', name:'Single Ride', description: 'Valid for 1 ride', price: 2.50, category: 'Adult'},
       {id: '2', name:'Express Ride', description: 'Valid for 1 ride', price: 5.50, category: 'Adult'},
       {id: '3', name:'Day Pass', description: 'Valid for 1 day', price: 7.50, category: 'Adult'},
       {id: '4', name:'Day Pass', description: 'Valid for 1 day', price: 7.50, category: 'Youth'}
    ]; 
    
    $scope.transactions = [
       {id: '1', time: '18:05  5/15/14', ticket: $scope.tickets[0] },
       {id: '1', time: '18:02  5/15/14', ticket: $scope.tickets[2] },
       {id: '1', time: '17:56  5/15/14', ticket: $scope.tickets[0] },
       {id: '1', time: '17:50  5/15/14', ticket: $scope.tickets[2] },
       {id: '1', time: '17:47  5/15/14', ticket: $scope.tickets[3] },
       {id: '1', time: '17:40  5/15/14', ticket: $scope.tickets[0] }              
    ]; 


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
   $scope.setTab = function(tab) {
       console.log(tab);
       $scope.activetab = tab;
       $rootScope.$emit('resizeMsg');
   };
   
   $scope.riderMetrics = {
     "type": "AreaChart",
     "displayed": true,
     "data": {
       "cols": [
         {
           "id": "month",
           "label": "Month",
           "type": "string",
           "p": {}
         },
         {
           "id": "laptop-id",
           "label": "Laptop",
           "type": "number",
           "p": {}
         },
         {
           "id": "desktop-id",
           "label": "Desktop",
           "type": "number",
           "p": {}
         },
         {
           "id": "server-id",
           "label": "Server",
           "type": "number",
           "p": {}
         },
         {
           "id": "cost-id",
           "label": "Shipping",
           "type": "number"
         }
       ],
       "rows": [
         {
           "c": [
             {
               "v": "January"
             },
             {
               "v": 19,
               "f": "42 items"
             },
             {
               "v": 12,
               "f": "Ony 12 items"
             },
             {
               "v": 7,
               "f": "7 servers"
             },
             {
               "v": 4
             }
           ]
         },
         {
           "c": [
             {
               "v": "February"
             },
             {
               "v": 13
             },
             {
               "v": 1,
               "f": "1 unit (Out of stock this month)"
             },
             {
               "v": 12
             },
             {
               "v": 2
             }
           ]
         },
         {
           "c": [
             {
               "v": "March"
             },
             {
               "v": 24
             },
             {
               "v": 5
             },
             {
               "v": 11
             },
             {
               "v": 6
             }
           ]
         }
       ]
     },
     "options": {
       "title": "Sales per month",
       "isStacked": "true",
       "fill": 20,
       "displayExactValues": true,
       "vAxis": {
         "title": "Sales unit",
         "gridlines": {
           "count": 10
         }
       },
       "hAxis": {
         "title": "Date"
       }
     },
     "formatters": {}
   };

     
   
   $scope.trxMetrics = {
     "type": "AreaChart",
     "displayed": true,
     "data": {
       "cols": [
         {
           "id": "month",
           "label": "Month",
           "type": "string",
           "p": {}
         },
         {
           "id": "laptop-id",
           "label": "Laptop",
           "type": "number",
           "p": {}
         },
         {
           "id": "desktop-id",
           "label": "Desktop",
           "type": "number",
           "p": {}
         },
         {
           "id": "server-id",
           "label": "Server",
           "type": "number",
           "p": {}
         },
         {
           "id": "cost-id",
           "label": "Shipping",
           "type": "number"
         }
       ],
       "rows": [
         {
           "c": [
             {
               "v": "January"
             },
             {
               "v": 19,
               "f": "42 items"
             },
             {
               "v": 12,
               "f": "Ony 12 items"
             },
             {
               "v": 7,
               "f": "7 servers"
             },
             {
               "v": 4
             }
           ]
         },
         {
           "c": [
             {
               "v": "February"
             },
             {
               "v": 13
             },
             {
               "v": 1,
               "f": "1 unit (Out of stock this month)"
             },
             {
               "v": 12
             },
             {
               "v": 2
             }
           ]
         },
         {
           "c": [
             {
               "v": "March"
             },
             {
               "v": 24
             },
             {
               "v": 5
             },
             {
               "v": 11
             },
             {
               "v": 6
             }
           ]
         }
       ]
     },
     "options": {
       "title": "Sales per month",
       "isStacked": "true",
       "fill": 20,
       "displayExactValues": true,
       "vAxis": {
         "title": "Sales unit",
         "gridlines": {
           "count": 10
         }
       },
       "hAxis": {
         "title": "Date"
       }
     },
     "formatters": {}
   };

     
}]);

