// Anchor scroll service
YouTiming.service('pageScroll', [ '$anchorScroll', '$location', 
    function($anchorScroll, $location) {
        this.page = function(position) {
            var old = $location.hash();
            $location.hash(position);
            $anchorScroll();
            $location.hash(old);
        };
        // not used
        this.top = function() {
            $location.hash('');
            $anchorScroll();
        };
    }]
);

// Get JSON data via $http
YouTiming.service('getData', ['$http', '$resource', function($http, $resource) {
    this.getJSON = function(filename) {
        return $http.get(filename);
    };
    //
    this.getQuote = function(ticker) {
//console.log('Get quote: ' + ticker + ', typeof = ' + typeof(ticker));
        if(typeof(ticker) === 'string') {
            var url = 'http://query.yahooapis.com/v1/public/yql';
            var data = encodeURIComponent(
                "select * from yahoo.finance.quotes where symbol in ('" + ticker + "')");
            url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
            return $resource(url);
        }
        else {
            console.log('Error in service getData.getQuote(): ticker not a string')
            return null;
        }
    };
    //
    this.getNews = function(ticker) {
        if(typeof(ticker) !== 'string') {
            console.log('Error, service getData.getNews(): ticker not a string')
            return null;
        }
        //
        var method = 'GET';
        var url = 'http://feeds.finance.yahoo.com/rss/2.0/headline?s=' +
            encodeURIComponent(ticker) + '&region=US&lang=en-US';
        return $resource(url);
    };
}]);

// Treat this service as a hash to store clicked page # for App1.
// This is done because the service is a singleton. 
YouTiming.service('pageHash', ['$location', 'home_page', 'archive_page', 
    function($location, home_page, archive_page) {
    var self = this;
    // get
    this.get = function(view, door, yang) {
        if(view == home_page) {
            if(door == yang) {
                return self.yangApp1;
            }
            else {
                return self.yinApp1;
            }
        }
        else if(view == archive_page) {
            if(door == yang) {
                return self.yangApp2;
            }
            else {
                return self.yinApp2;
            }
        }
    };
    // hash the top page
    this.hashTopPage = function() {
        self.topPage = $location.hash();
    };
    // put
    this.put = function(view, door, page, yang) {
        if(view == home_page) {
            if(door == yang) {  // ? cannot see the constant, yang, so passed to avoid hard-coding
                self.yangApp1 = page;
            }
            else {
                self.yinApp1 = page;
            }
        }
        else if(view == archive_page) {
            if(door == yang) {
                self.yangApp2 = page;
            }
            else {
                self.yinApp2 = page;
            }
        }
    };
}]);