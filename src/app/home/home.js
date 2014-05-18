
angular.module( 'ngZoute.service', [
'ngStorage'
])

.factory('Agency', ['$http', '$q', function($http, $q) {
    var _server = 'https://api.zoute.me/';
    var _data = {
        agencies: []
    };
    return {
        data: _data,
        fetchAll: function() {
            var deferred = $q.defer();
            $http.get( _server + "agency/all"  
                   ).success(function (data, status, headers, config) {
                       if ( data && data.code === 0 ) {
                           angular.copy(data.agencies,_data.agencies);
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
}])

.factory('User', ['$http', '$localStorage', '$q', function($http, $localStorage, $q) {
  
    var server = 'http://127.0.0.1:5000/';//'http://107.170.76.249:8080/';
    return {
        logout: function() {
            var deferred = $q.defer();
            var access = $localStorage.access;
            /* jshint -W024 */
            $http.delete( server + "/session?access=" + access  
                   ).success(function (data, status, headers, config) {
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
                       if ( data.code === 0 )  {
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
                       if ( data.code === 0 )  {
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
        agency_ticket_transactions: function(agency_id) {
            
            var deferred = $q.defer();
            
            $http.get( server + '/agency/' + agency_id + '/ticket?access=' + $localStorage.access
                   ).success(function (data, status, headers, config) {                       
                       if ( data.code === 0 )  {
                           var out = [];
                           for ( var i = 0; i < data.tickets.length; i++) {
                               out = data.tickets[i];
                               out.issued_date = new Date(out.issued_timestamp*1000);
                               out.price_dollars = out.ticket_price / 100;
                           }
                           deferred.resolve(data.tickets);
                           return;
                       }
                       
                       deferred.reject(data.code);
                       
                   }).error(function (data, status, headers, config) {
                       deferred.reject(-1);
                   });
                   
            return deferred.promise;
            
        },
        agency_ticket_type: function(agency_id) {
            
            var deferred = $q.defer();
            
            $http.get( server + '/ticket/types/' + agency_id 
                   ).success(function (data, status, headers, config) {                       
                       if ( data.code === 0 )  {
                           for ( var i = 0; i < data.ticket_types.length; i++) {
                               var out = data.ticket_types[i];
                               out.price_dollars = out.ticket_price / 100;
                           }
                           deferred.resolve(data.ticket_types);
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
.controller( 'HomeCtrl', [ '$rootScope','$scope', '$location', '$localStorage', 'User', 'Agency', 
    function HomeController( $rootScope, $scope, $location, $localStorage, User, Agency ) {
        
    $scope.agencies = Agency.data.agencies;
    
    Agency.fetchAll().then(function success(data) 
        { 
            User.profile().then(
               function success(data) {
                   $scope.isActive = true;
                   $scope.user = data.user;
                   $scope.agency_id = data.user.agency_access.length > 0 ? data.user.agency_access[0].agency_id : undefined;
                   $scope.agency = loadAgency($scope.agency_id);
               },
               function fail(data) {
                   $scope.isActive = false;
                   $scope.user = {};
               }) ;
            
        });
    
    function loadAgency(agency_id) {
        User.agency_ticket_transactions(agency_id).then(
               function success(tickets) {
                   angular.copy(tickets,$scope.transactions);
               }
           );
           User.agency_ticket_type(agency_id).then(
                  function success(tickets) {
                      angular.copy(tickets,$scope.tickets);
                  }
              );
    
        
        for (var i = 0; i < $scope.agencies.length; i++) { 
            var agency = $scope.agencies[i];
            if ( agency.agency_id === agency_id ) {
                return agency;
            }
        }
        return {};
    }
    
    $scope.isActive = false;
       
    $scope.tabs = [
           {name:'Transactions'},
           {name:'Rider Metrics'},
           {name:'Transaction Metrics'},
           {name:'Ticket Types'}
    ];  
    $scope.activetab = "Transactions";
    
    $scope.tickets = [
       {id: '1', name:'Single Ride', description: 'Valid for 1 ride', price: 2.50, category: 'Adult'},
       {id: '2', name:'Express Ride', description: 'Valid for 1 ride', price: 5.50, category: 'Adult'},
       {id: '3', name:'Day Pass', description: 'Valid for 1 day', price: 7.50, category: 'Adult'},
       {id: '4', name:'Day Pass', description: 'Valid for 1 day', price: 7.50, category: 'Youth'}
    ]; 
    
    $scope.ticketOptions = { data: 'tickets',
        columnDefs: [
            {field:'ticket_name',        displayName:'Name'},
            {field:'ticket_description', displayName:'Description'},  
            {field:'price_dollars',       displayName:'Price', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | currency }}</div>' },
            {field:'ticket_category_name',    displayName:'Category'}
        ]
     };

    $scope.trxOptions = { 
        data: 'transactions',
        columnDefs: [
            {field:'issued_date',               displayName:'Issued Timestamp', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | date:"short" }}</div>' },
            {field:'ticket_name',        displayName:'Name'},
            {field:'ticket_description', displayName:'Description'},  
            {field:'price_dollars',       displayName:'Price', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | currency }}</div>' },
            {field:'ticket_category_name',    displayName:'Category'}
        ]
    };
    
    $scope.transactions = []; 


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
           "label": "Adult",
           "type": "number",
           "p": {}
         },
         {
           "id": "desktop-id",
           "label": "Child",
           "type": "number",
           "p": {}
         },
         {
           "id": "server-id",
           "label": "Senior",
           "type": "number",
           "p": {}
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
             }
           ]
         }
       ]
     },
     "options": {
       "title": "Rider per month",
       "isStacked": "true",
       "fill": 20,
       "displayExactValues": true,
       "vAxis": {
         "title": "Rider category",
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

