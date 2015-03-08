// the var YT_Filters is just a nameing container; it's not used anywhere
var YT_Filters = angular.module('customFilter', [])
.filter('date', function() {
    return function(data, propertyName) {
        if (angular.isArray(data) && angular.isString(propertyName)) {
            var results = [];
            var keys = {};
            for (var i = 0; i < data.length; i++) {
                var val = data[i][propertyName];
                if (angular.isUndefined(keys[val])) {
                    keys[val] = true;
                    results.push(val);
                }
            }
            return results;
        } else {
            return data;
        }
    }
})
.filter('door', function() {
    return function(data, type) {
        if(angular.isArray(data)) {
            var result = [], rctr = 0;
            for (var i = 0, len = data.length; i < len ; i++) {
                if(data[i].door.type == type) {
                    result[rctr++] = data[i];
                }
            }
            return result;
        } else {
            return data;
        }
    }
})
.filter('pageCount', function() {
    return function(data, type, size) {
        if(angular.isArray(data)) {
            var result = [], match = 0, page_count = 0;
            for (var i = 0, len = data.length; i < len ; i++) {
                if(data[i].door.type == type) ++match;
                if(match == size || (i+1) == len && match > 0) {
                    result[page_count] = ++page_count;
                    match = 0;
                }
            }
            return result;
        }
        else {
            return data;
        }
    }
})
.filter('range', function($filter) {
    // page: the selected page
    // size: from the constant, tickerPerPage
    return function(data, type, page, size) {
//console.log(angular.isArray(data) + ", " + type + ', ' + angular.isNumber(page) + ", " + angular.isNumber(size));
        if(angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
            var result = [];
            for(var i = 0, len = data.length; i < len; ++i) {
                if(data[i].door.type == type) {
                    result[result.length] = data[i];
                }
            }
            if(result.length == 0) return [];
            var start_index = (page - 1) * size;
            return $filter('limitTo')(result.splice(start_index), size);
        }
        else {
            return data;
        }
    }
})
.filter('tracePageCount', function() {  // for tracing purpose
    return function(data, type, size, ticker, dat1) {
        if(angular.isArray(data)) {
            var result = [], match = 0, page_count = 0;
            for (var i = 0, len = data.length; i < len ; i++) {
                ++match;
                if(match == size || (i+1) == len && match > 0) {
                    result[page_count] = ++page_count;
                    match = 0;
                }
            }
            return result;
        }
        else {
            return data;
        }
    }
})
.filter('unique', function() {
    return function(data, propertyName) {
        if (angular.isArray(data) && angular.isString(propertyName)) {
            var results = [];
            var keys = {};
            for (var i = 0; i < data.length; i++) {
                var val = data[i][propertyName];
                if (angular.isUndefined(keys[val])) {
                    keys[val] = true;
                    results.push(val);
                }
            }
            return results;
        } else {
            return data;
        }
    }
})
;