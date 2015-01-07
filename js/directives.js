// For custom defined html element 'current-yang-session':
YouTiming.directive("currentSession", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/current_session.html',
       replace: false,
       scope: {
           // defining the directive's attributes:
           s: '=',  // '=': object-binding, the two-way binding
           t: '@'
       }
       //transclude: true
   }
});

// For custom defined html element 'monthly-season':
YouTiming.directive("metaphoreNote", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/metaphore_note.html',
       replace: false,
       scope: {
           // defining the directive's attributes:
           a: '&',
           r: '&',  // '&': the function-binding
           s: '=',  // '=': object-binding, the two-way binding
           t: '@'   // '@': text-binding, the one-day binding
       }
   }
});

// For custom defined html element 'monthly-season':
YouTiming.directive("monthlySeason", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/monthly_season.html',
       replace: false,
       scope: {
           // defining the directive's attributes:
           g: '&',
           s: '=',  // '=': object-binding, the two-way binding
           t: '@'
       }
   }
});

// For custom defined html element 'pattern-data':
YouTiming.directive("patternData", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/pattern_data.html',
       replace: false,
       scope: {
           // defining the directive's attributes:
           s: '='  // '=': object-binding, the two-way binding
       }
   }
});

// For custom defined html element 'pattern-data':
YouTiming.directive("sessionData", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/session_data.html',
       replace: false,
       scope: {
           // defining the directive's attributes:
           r: '&',  // '&': the function-binding
           s: '=',  // '=': object-binding, the two-way binding
           t: '@'   // '@': text-binding, the one-day binding
       }
   }
});