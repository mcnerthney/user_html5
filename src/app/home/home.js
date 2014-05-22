
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

.factory('User', ['$http', '$localStorage', '$q', '$filter', function($http, $localStorage, $q, $filter) {
  
  
    
    Date.prototype.getWeek = function() {
          var onejan = new Date(this.getFullYear(), 0, 1);
          return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };  
  
    var server = 'http://107.170.76.249:8080/';
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
        fixup_trx: function (out ) {
            if ( !out.issued_date ) {
                out.issued_date = new Date(out.issued_timestamp*1000);
            }
            out.price_dollars = out.ticket_price / 100;
            out.Day = $filter('date')(out.issued_date, "yyyy-MM-dd");
            out.Month = $filter('date')(out.issued_date, "yyyy-MM");            
            out.Week =  $filter('date')(out.issued_date, "yyyy") +  ' Week #' + out.issued_date.getWeek();   
        },
        agency_ticket_transactions: function(agency_id) {
            var self = this;
            var deferred = $q.defer();
            
            $http.get( server + '/agency/' + agency_id + '/ticket?access=' + $localStorage.access
                   ).success(function (data, status, headers, config) {                       
                       if ( data.code === 0 )  {
                           for ( var i = 0; i < data.tickets.length; i++) {
                               self.fixup_trx(data.tickets[i]);
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
.config(function config( $stateProvider) {
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
.controller( 'HomeCtrl', [ '$rootScope','$scope', '$location', '$localStorage', 'User', 'Agency',  '$filter',
'googleChartApiPromise', '$window',
    function HomeController( $rootScope, $scope, $location, $localStorage, User, Agency  , $filter, googlechart, $window ) {
        
    $scope.agencies = Agency.data.agencies;
    
   
    Array.prototype.pushArray = function() {
        var toPush = this.concat.apply([], arguments);
        for (var i = 0, len = toPush.length; i < len; ++i) {
            this.push(toPush[i]);
        }
    };
    
    var allTrx = [];
    $scope.trxDateRange = {
        startDate: moment().subtract('months',2).startOf('month'),
        endDate:  moment()
    };
    
    
    $scope.$watch('trxDateRange', function(newVal, oldVal) {
        filterByDateRange(newVal);
        setGroup();
    });
    
    function filterByDateRange(range) {
        $scope.transactions.length = 0;
        _.each(allTrx, function(trx) {
            if ( $scope.trxDateRange.startDate <= trx.issued_date && $scope.trxDateRange.endDate >= trx.issued_date ) {
                $scope.transactions.push(trx);
            }
        });   
    }
    function pingTrxs() {
        if ( $scope.activetab === "Transactions" ) {
            User.agency_ticket_transactions($scope.agency_id).then(
               function success(tickets) {
                   allTrx.length = 0;
                   angular.copy(tickets,allTrx);
                   allTrx.pushArray(demoTrxs);
                   
                   filterByDateRange($scope.trxDateRange);
                   
                   
                   setTimeout(pingTrxs, 1000);  
               },
               function fail(){
                   setTimeout(pingTrxs, 1000);  
               }
           );
        }
        else {
           setTimeout(pingTrxs, 1000);     
        }
    }    
    pingTrxs();

    $scope.activetype = 'Ticket Type';
    $scope.activesum = 'Count';

    $scope.riderChartData = null;
    function setGroup() {

        //$scope.trxOptions.groupBy(null);
        //$scope.trxOptions.groupBy(group);
        //$scope.trxOptions.sortBy('issued_date');
        
        
        var valueType = 'ticket_category_name';
        if ( $scope.activetype === 'Ticket Type') {
            valueType = 'ticket_name';
        }
    
        
        var aCategory = _.map(_.groupBy($scope.transactions , function(item){ return item[valueType];}), 
                                  function( value, key ) {
                                    return key;
                                  });
        var groupedByDate = _.groupBy($scope.transactions , function(item){ 
           if ( $scope.activegroup === 'Day') {    
              return $filter("date")(item.issued_date,'yyyy-MM-dd');
          }
          if ( $scope.activegroup === 'Week' ) {
            return $filter("date")(item.issued_date,'yyyy-') + moment(item.issued_date).week();    
          }
          if ( $scope.activegroup === 'Month' ) {
            return $filter("date")(item.issued_date,'yyyy-MM');    
          }
          return rtn;
        });
        
        var arrayCategory = _.sortBy(aCategory, function (cat) { return cat; });
        //arrayCategory.reverse();
        
         
        var rows = _.map(groupedByDate, 
        function (value,date) {
          var cols = _.map(arrayCategory, function(cat) { 
              return 0;
          }); 
  
          _.map(_.groupBy(value, function (tix) {
              return tix[valueType];
          }), function(cat, cat_key) {
            var re = _.reduce(cat, function(memo, tix){ 
      
            return memo + ($scope.activesum === 'Count' ? 1 : tix.price_dollars); }, 0);
  
            //console.log(' computed ' + date + ',' + cat_key + ',' + re);
    
            _.each(arrayCategory, function(tcat, index){
              if ( tcat === cat_key ) {
                //console.log('      found ' + date + ',' + tcat );
                cols[index] += re;
              }
                  });
            return re;
          });

          var date_row = cols;
          date_row.unshift(date);
          return date_row;
        });

        // header
        var y_header = arrayCategory;
        y_header.unshift('year');
        
        var drows = _.sortBy(rows, function (r) { return r[0]; });
        drows.unshift(y_header);

        $scope.riderChartData = google.visualization.arrayToDataTable(drows, 
            false); // 'false' means that the first row contains labels, not data.
              $scope.riderMetrics = {
                "type": "AreaChart",
                "data": $scope.riderChartData,
                "displayed": true,
                 "options": {
                  "title": "Tickets per " + $scope.activegroup,
                  "isStacked": "true",
                  "fill": 20,
                  "displayExactValues": true,
                  "vAxis": {
                    "title": "Ticket " + $scope.activesum,
                    "gridlines": {
                      "count": 10
                    }
                  },
                  "hAxis": {
                    "title": $scope.activegroup
                  }
                },
                "formatters": {}
              };

              
        
    }
    $scope.clickGroup = function(g) {
        $scope.activegroup = g;       
        setGroup();
        
    };
    
    $scope.clickType = function(t) {
        $scope.activetype = t;
        setGroup();
    };
        
    $scope.clickSum = function(t) {
        $scope.activesum = t;
        setGroup();
    };
        

    
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
    
        var demoTrxs = [];
        function generateTestData()
        {  
            demoTrxs = createDemoTrxs(2000);
         }
        function loadAgency(agency_id) {
           User.agency_ticket_type(agency_id).then(
                  function success(tickets) {
                      angular.copy(tickets,$scope.tickets);
                      generateTestData();                              
                      
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
           {name:'Ticket Metrics'},
        //   {name:'Transaction Metrics'},
           {name:'Ticket Types'}
    ];  
    $scope.activetab = "Transactions";
    
    $scope.tickets = [
    ]; 
    
    $scope.ticketOptions = { data: 'tickets',
        beforeSelectionChange: function() {
            return false;
        },
        columnDefs: [

            {field:'ticket_name',        displayName:'Name'},
            {field:'ticket_description', displayName:'Description'},  
            {field:'price_dollars',       displayName:'Price', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | currency }}</div>' },
            {field:'ticket_category_name',    displayName:'Category'}
        ]
     };
     
     function descSortFn(a,b){
         if (a == b) {    
             return 0;
         }
         if (a < b) {
             return 1;
         }
         return -1;
     }
     
     
     var myHeaderCellTemplate = '<div ng-click="row.toggleExpand()" ng-style="rowStyle(row)" class="ngAggregate"><span class="ngAggregateText">{{row.label CUSTOM_FILTERS}} Count: {{row.totalChildren()}} Total Price: {{aggFC(row) | currency }}  </span><div class="{{row.aggClass()}}"></div></div>';
     $scope.aggFC = function (row) {
        var res = 0;

        var calculateChildren = function(cur) {
          var res = 0;
          var remaining;
          angular.forEach(cur.children, function(a) {
            remaining = a.getProperty('price_dollars');
            if (remaining) { res += remaining; }
          });
          return res;
        };

        var calculateAggChildren = function(cur) {
          var res = 0;
          res += calculateChildren(cur);
          angular.forEach(cur.aggChildren, function(a) {
            res += calculateAggChildren(a);
          });
          return res;
        };

        return (calculateAggChildren(row)).toFixed(2);
      };

    $scope.trxOptions = { 
        data: 'transactions',
        sortInfo: {
          fields: ['issued_date'],
          directions: ['asc']
        },
        columnDefs: [
            {field:'Day',        displayName:'Day', visible: false, headerCellTemplate: myHeaderCellTemplate },
            {field:'Week',        displayName:'Week', visible: false },
            {field:'Month',        displayName:'Month', visible: false },
            {field:'issued_date',  sortFn: descSortFn, displayName:'Issued Timestamp', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | date:"short" }}</div>' },
            {field:'ticket_name',        displayName:'Name'},
            {field:'ticket_description', displayName:'Description', width: 300},  
            {field:'price_dollars',      width: 80, displayName:'Price', cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field) | currency }}</div>' },
            {field:'ticket_category_name',    displayName:'Category'}

        ],
        aggregateTemplate: myHeaderCellTemplate 

    };
    
 
    
    var exportFields = [
    { field: 'issued_date'  , value: function(trx) { return $filter('date')(trx.issued_date,'yyyy-MM-dd HH:mm:ss'); } },
    { field: 'ticket_name' },
    { field: 'ticket_description' },
    { field: 'ticket_category_name' },
    { field: 'price_dollars', header: 'price', value: function(trx) { return trx.price_dollars; } }
    ];
    
    $scope.cvsExportHeader = function() {
        var out = [];
        _.each(exportFields, function(fld) {
            if ( typeof fld.header === 'string' ) {
                out.push(fld.header);
            }
            else {
                out.push(fld.field);
            }
        });
        return out;
    };
        
    $scope.cvsExportData = function() {
        var out = [];
        _.each($scope.transactions, function cvsTrx(trx) {
            var trxout = {};
            _.each(exportFields, function cvsField(fld) {
                if ( typeof fld.value === 'function' ) {
                    trxout[fld.field] = fld.value(trx);
                }
                else {
                    trxout[fld.field] = trx[fld.field];
                }
            });
            out.push(trxout);
        });
        return out;
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
       setGroup();
       $scope.activetab = tab;
       $rootScope.$emit('resizeMsg');
       if ( tab === 'Ticket Metrics' && !$scope.activegroup ) {
           //$scope.clickGroup('Day');
       }

   };
 
        
   function createDemoTrxs(count) {
    
       Math.seedrandom('dataset1.' + count);
       var trxdate = new Date('2014-05-19T14:10:05'); 
       var total_weight = _.reduce(random_ticket_types, 
           function(memo, tix){
               if ( !tix.weight ) {
                   tix.weight = Math.floor(Math.random() * 5);
               } 
               return memo + tix.weight; 
           }, 0);

       var trxs = [];
       var trx;
       var v = 0;
       var r = 0;
       function findtix(tix) {
           if ( r <= v + tix.weight ) {
               angular.copy(tix,trx);
               return true;
           }
           v += tix.weight;
           return false;
       }
       
       for ( var i = 0; i < count; i++) {
   
           trx = {};
           
           r = ( Math.floor(Math.random() * total_weight));
           v = 0;
            _.find(random_ticket_types, findtix);
           
           trx.issued_date = new Date(trxdate);
           trxdate.setMinutes(trxdate.getMinutes() - ( Math.floor(Math.random() * 100)) );
           User.fixup_trx(trx);
           trxs.push(trx);
       }
       return trxs;
   }

   var random_ticket_types = [
       {
           "weight": 50,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Good for a single ride", 
         "ticket_id": 1, 
         "ticket_name": "Single Ride", 
         "ticket_price": 200
       }, 
       {
           "weight": 5,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Good for a single express ride", 
         "ticket_id": 100, 
         "ticket_name": "Express Single Ride", 
         "ticket_price": 400
       }, 
       {
           "weight": 7,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "A single community bus ride", 
         "ticket_id": 500, 
         "ticket_name": "Community Bus", 
         "ticket_price": 125
       }, 
       {
                      "weight": 10,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Good for 8hrs Light-Rail ride", 
         "ticket_id": 1000, 
         "ticket_name": "8-Hour Light Rail Pass", 
         "ticket_price": 400
       }, 
       {
                    "weight": 5,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Expires at midnight", 
         "ticket_id": 1001, 
         "ticket_name": "Day Pass", 
         "ticket_price": 600
       }, 
       {
              "weight": 15,
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Expires at midnight", 
         "ticket_id": 1002, 
         "ticket_name": "Express Day Pass", 
         "ticket_price": 1200
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Expires at the end of the month", 
         "ticket_id": 2000, 
         "ticket_name": "Monthly Pass", 
         "ticket_price": 7000
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Adult (Ages 18-64)", 
         "ticket_description": "Expires at the end of the month ", 
         "ticket_id": 2001, 
         "ticket_name": "Express Monthly Pass", 
         "ticket_price": 14000
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Youth (Ages 5-17)", 
         "ticket_description": "Good for Regular, Limited, Express Buses, Light Rail", 
         "ticket_id": 10000, 
         "ticket_name": "Single Ride", 
         "ticket_price": 175
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Youth (Ages 5-17)", 
         "ticket_description": "A single community bus ride", 
         "ticket_id": 10500, 
         "ticket_name": "Community Bus", 
         "ticket_price": 75
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Youth (Ages 5-17)", 
         "ticket_description": "Good for 8hrs Light-Rail ride", 
         "ticket_id": 101000, 
         "ticket_name": "8-Hour Light Rail Pass", 
         "ticket_price": 350
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Youth (Ages 5-17)", 
         "ticket_description": "Expires at midnight", 
         "ticket_id": 101001, 
         "ticket_name": "Day Pass", 
         "ticket_price": 500
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Youth (Ages 5-17)", 
         "ticket_description": "Expires at the end of the month", 
         "ticket_id": 102000, 
         "ticket_name": "Monthly Pass", 
         "ticket_price": 4500
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Senior (Ages 65+)", 
         "ticket_description": "Good for Regular, Limited, Express Buses, Light Rail", 
         "ticket_id": 20000, 
         "ticket_name": "Single Ride", 
         "ticket_price": 100
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Senior (Ages 65+)", 
         "ticket_description": "A single community bus ride", 
         "ticket_id": 20500, 
         "ticket_name": "Community Bus", 
         "ticket_price": 50
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Senior (Ages 65+)", 
         "ticket_description": "Good for 8hrs Light-Rail ride", 
         "ticket_id": 201000, 
         "ticket_name": "8-Hour Light Rail Pass", 
         "ticket_price": 200
       }, 
       {
         "agency_id": 1, 
         "ticket_category_name": "Senior (Ages 65+)", 
         "ticket_description": "Good for all rides", 
         "ticket_id": 201001, 
         "ticket_name": "Day Pass", 
         "ticket_price": 250
       }
     ];
     
     $window.setTimeout( function() { $scope.activegroup = 'Week'; setGroup(); }, 1000);
     
}]);

