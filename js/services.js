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