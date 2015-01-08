// Get JSON data via $http
YouTiming.service('getData', ['$http', '$resource', function($http, $resource) {
    this.getJSON = function(filename) {
        return $http.get(filename);
    };
    this.getQuote = function(ticker) {
//console.log(ticker);
        var url = 'http://query.yahooapis.com/v1/public/yql';
        var data = encodeURIComponent(
            "select * from yahoo.finance.quotes where symbol in ('" + ticker + "')");
        url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        return $resource(url);
    }
}]);

// Treat this service as a hash to store clicked page # for App1.
// This is done because the service is a singleton. 
YouTiming.service('pageHash', function() {
    var self = this;
    // put
    this.put = function(view, door, page, yang) {
        if(view == 'App1') {
            if(door == yang) {  // ? cannot see the constant, yang, so passed to avoid hard-coding
                self.yangApp1 = page;
            }
            else {
                self.yinApp1 = page;
            }
        }
        else if(view == 'App2') {
            if(door == yang) {
                self.yangApp2 = page;
            }
            else {
                self.yinApp2 = page;
            }
        }
    }
    // get
    this.get = function(view, door, yang) {
        if(view == 'App1') {
            if(door == yang) {
                return self.yangApp1;
            }
            else {
                return self.yinApp1;
            }
        }
        else if(view == 'App2') {
            if(door == yang) {
                return self.yangApp2;
            }
            else {
                return self.yinApp2;
            }
        }
    }
});