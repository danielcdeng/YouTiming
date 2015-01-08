YouTiming.config(['$routeProvider', '$resourceProvider', 
    function($routeProvider, $resourceProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/home.html'
        })
        .when('/about', {
            templateUrl: '/about.html'
        })
        .when('/archive/:ticker', {             // the archive view, controller "App2"
            templateUrl: '/archive.html'
        })
        .when('/contact', {
            templateUrl: '/contact.html'
        })
        .when('/flock/:ticker/date/:dat1', {    // the flock view, controller "Flock"
            templateUrl: '/flock.html'
        })
        .otherwise({
            templateUrl: '/home.html'      // the home view, controlelr "App1"
        });

        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
}]);