YouTiming.config(['$httpProvider', '$resourceProvider', '$routeProvider',
    function($httpProvider, $resourceProvider, $routeProvider) {
        // Enabling CORS in AngularJS: doesn't work
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $routeProvider
        .when('/', {
            templateUrl: '/home.html'
        })
        .when('/about', {
            templateUrl: '/about.html'
        })
        .when('/archive/:ticker', {         // the archive view, controller "App2"
            templateUrl: '/archive.html'
        })
        .when('/contact', {
            templateUrl: '/contact.html'
        })
        .when('/trace/:fore/:type', {  // the trace view, controller "Trace"
            templateUrl: '/trace.html'
        })
        .otherwise({
            templateUrl: '/home.html'       // the home view, controlelr "App1"
        });
    }]
);