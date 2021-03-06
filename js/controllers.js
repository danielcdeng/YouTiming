﻿// This is the init controller used in index.html whose
// main view is home.html. This guy only gets executed once.
// Duty: GET active.json (portfolio).
// Code: 0 - init app, 1 - portfolio app, 2 - archive app
YouTiming.controller('App0', ['$scope', 'yang', 'yin', 'modeldir', 
    'weekfname', 'portfname', 'tickerPerPage', 'getData', 
    function($scope, yang, yin, modeldir, weekfname, portfname, tickerPerPage, getData) {
        //
    	$scope.weekly = {};
        $scope.portf = {};
        $scope.portf.tickers1 = [];
        $scope.yang_doors1 = 0;
        $scope.yin_doors1 = 0;
        $scope.yang = yang;
        $scope.yin = yin;
        $scope.pageSize = tickerPerPage;
        //
        if(!$scope.yangSP1) {
            $scope.yangSP1 = 1; // user selected page on home.html view
        }
        if(!$scope.yinSP1) {
            $scope.yinSP1 = 1;
        }
        // Utility functions:
        $scope.abs = function(fval) {
            return Math.abs(fval);
        };
        $scope.average = function(f1, f2) {
            if(f1 == "n/a") f1 = 0;
            if(f2 == "n/a") f2 = 0;
            var v1 = parseFloat(f1), v2 = parseFloat(f2);
            if(v1 == 0) return v2;
            if(v2 == 0) return v1;
            return (v1 + v2) / 2;
        };
        $scope.convertToFloat = function(vs) {
            return parseFloat(vs);
        };
        $scope.getColor = function(door) {
            if(door == 'yang') return "yang-color";
            else return "yin-color";
        };
        $scope.roundup = function(fval, iprecision) {
            return Math.round(parseFloat(fval) * Math.pow(10, iprecision)) / Math.pow(10, iprecision);
        };
        //
    	// portfolio--do this for TList controller
    	//$http.get(modeldir + portfname)
        getData.getJSON(modeldir + portfname)
    	.success(function(response, status, headers, config) {
        	$scope.portf.tickers1 = response;
            // for the sorting on forecast date in view
        	$scope.predicate = 'door.dat1';
        	$scope.reverse = true;
            // 
            for(var i = 0, len = $scope.portf.tickers1.length; i < len; ++i) {
                var pri1 = parseFloat($scope.portf.tickers1[i].door.pri1);
                var pri2 = parseFloat($scope.portf.tickers1[i].sess.pri2);
                // Ticker.ut9() java gurantees that pri2 always has a value
                if(pri1 == pri2) {
                    // this is a newly fresh session that has not found the top/bottom
                    $scope.portf.tickers1[i].sess.dat2 = 'n/a';
                    $scope.portf.tickers1[i].sess.pri2 = 'n/a';
                    pri2 = undefined;
                }
                //
                switch($scope.portf.tickers1[i].door.type) {
                    case yang:
                        ++$scope.yang_doors1;
                        break;
                    case yin:
                        ++$scope.yin_doors1;
                        break;
                    default: alert("Error: unknwon door type"); break;
                }
            }
    	})
    	.error(function(response, status, headers, config) {
            console.log("Parsing error: active.json");
    		$scope.portf.error = status;
    	});
    }]
);

// This controller is used in home.html which is the main view of index.html.
// Duty: when the index.html firstly gets loaded, this guy doesn't do anything;
//       it is mainly responsible for pagination if ther user clicks.
YouTiming.controller('Home', ['$scope', 'pageScroll', 'yang', 'yin', 'yangPageActiveClass', 
    'yinPageActiveClass','tickerPerPage', 'clicklist', 'clickpage', 'pageHash', 'guidance', 'miss',
    'home_pos', 'home_neg', 'home_page', 
    function($scope, pageScroll, yang, yin, yangPageActiveClass, yinPageActiveClass, tickerPerPage, 
        clicklist, clickpage, pageHash, guidance, miss, home_pos, home_neg, home_page) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        // restore the previously clicked page # from the service singleton
        var cpage = pageHash.get(home_page, yang, yang);  // the 3rd par is passed and used as a constant
        if(cpage !== undefined) $scope.yangSP1 = cpage;
        cpage = pageHash.get(home_page, yin, yang);
        if(cpage !== undefined) $scope.yinSP1 = cpage;
        //
        $scope.getSP1Class = function(type, page) {
            switch(type) {
                case yang:
                    return $scope.yangSP1 == page ? yangPageActiveClass : '';
                case yin:
                    return $scope.yinSP1 == page ? yinPageActiveClass : '';
                default: alert('Error: Home, 001');
            }
        };
        //
        $scope.pageScroll = pageScroll;
        //
        $scope.selectSP1 = function(from, type, index) {
            var page = 0;
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            pageHash.put(home_page, type, page, yang); // store the clicked page # into the service singleton
            //
            var position = null;
            switch(type) {
                case yang:
                    position = home_pos;
                    $scope.yangSP1 = page;
                    break;
                case yin: 
                    position = home_neg;
                    $scope.yinSP1 = page;
                    break;
                default:
                    anchorScoll.top();
                    break;
            }
            pageScroll.page(position);
        };
        //
        $scope.guidance = guidance;
        $scope.miss = miss;
    }]
);

// This controller is used in archive.html.
// Duty: to GET single ticker's historical JSON data.
YouTiming.controller('Archive', ['$scope', '$routeParams', 'pageScroll', 'yang', 'yin', 
    'yangPageActiveClass', 'yinPageActiveClass', 'tickerPerPage', 'histdir', 'clicklist', 
    'clickpage', 'pageHash', 'getData', 'guidance', 'miss', 'archive_neg', 'archive_pos',
    'archive_page', 
    function($scope, $routeParams, pageScroll, yang, yin, yangPageActiveClass, 
        yinPageActiveClass, tickerPerPage, histdir, clicklist, clickpage, pageHash, getData, 
        guidance, miss, archive_neg, archive_pos, archive_page) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        // restore the previously clicked page # from the service singleton
        var cpage = pageHash.get(archive_page, yang, yang);  // the 3rd par is passed and used as a constant
        if(cpage !== undefined) $scope.yangSP2 = cpage;
        cpage = pageHash.get(archive_page, yin, yang);
        if(cpage !== undefined) $scope.yinSP2 = cpage;
        //
        $scope.getSP2Class = function(type, page) {
            switch(type) {
                case yang: return $scope.yangSP2 == page ? yangPageActiveClass : '';
                case yin: return $scope.yinSP2 == page ? yinPageActiveClass : '';
                default: alert('Error: Archive, 001');
            }
        };
        //
        $scope.pageScroll = pageScroll;
        //
        $scope.selectSP21 = function(from, type, index) {
            var page = 0;
            //
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            pageHash.put(archive_page, type, page, yang);
            //
            var position = null;
            switch(type) {
                case yang:
                    position = archive_pos;
                    $scope.yangSP2 = page;
                    break;
                case yin:
                    position = archive_neg;
                    $scope.yinSP2 = page;
                    break;
            }
            pageScroll.page(position);
        };
        //
        $scope.selectSP22 = function(from, type, index) {
            var page = 0;
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            pageHash.put(archive_page, type, page, yang); // store the clicked page # into the service singleton
            //
            switch(type) {
                case yang:
                    $scope.yangSP2 = page;
                    break;
                case yin: 
                    $scope.yinSP2 = page;
                    break;
            }
        };
        //
        if(!$scope.archive) {
            // loaded the first time
            $scope.portf = {};
            $scope.portf.tickers2 = [];
            $scope.yang_doors2 = 0;
            $scope.yin_doors2 = 0;
            var ticker = $routeParams.ticker;
            //$http.get(histdir + ticker + '.json')
            getData.getJSON(histdir + ticker + '.json')
            .success(function(response, status, headers, config) {
                $scope.portf.tickers2 = response;
                // actually no need to define again (already done in main.js)
                $scope.predicate = 'door.dat1';
                $scope.reverse = true;
                // 
                for(var len = $scope.portf.tickers2.length, i = len - 1, idx = 0; i >= 0; --i) {
                    $scope.portf.tickers2[i].tick.sequ = i+1;
                    //
                    var pri1 = parseFloat($scope.portf.tickers2[i].door.pri1);
                    var pri2 = parseFloat($scope.portf.tickers2[i].sess.pri2);
                    switch($scope.portf.tickers2[i].door.type) {
                        case yang:
                            if(pri2 <= pri1) pri2 = undefined; 
                            break;
                        case yin:
                            if(pri2 >= pri1) pri2 = undefined;
                            break;
                        default: alert("Error: Archive, 003"); break;
                    }
                    if(pri2 === undefined) {
                        $scope.portf.tickers2[i].sess.dat2 = 'n/a';
                        $scope.portf.tickers2[i].sess.pri2 = 'n/a';
                    }
                }
                $scope.portf.error = undefined;
                //
                $scope.ticker = {};
                $scope.ticker.tick = {};
                $scope.ticker.tick.name = ticker;
                if($scope.portf.tickers2[0]) {
                    $scope.ticker.tick.titl = $scope.portf.tickers2[0].tick.titl;
                }
            })
            .error(function(response, status, headers, config) {
                $scope.portf.error = status;
                console.log('Error: Archive, 004')
            });
            //
            if(!$scope.yangSP2) $scope.yangSP2 = 1; // user selected page on archive.html view
            if(!$scope.yinSP2) $scope.yinSP2 = 1;
            $scope.archive = true;
        }
        //
        $scope.guidance = guidance;
        $scope.miss = miss;
    }]
); // Archive

// Get stock quote in home.html.
YouTiming.controller('StockREST', ['$scope', 'getData',
    function($scope, getData) {
        var getQuote = function(symbol) {
            var api = getData.getQuote(symbol);
            if(api == null) return;
            var data = api.get({symbol:symbol}, function() {
                var quote = data.query.results.quote;
                $scope.lang = data.query.lang;
                $scope.lastTradeDate = quote.LastTradeDate;
                $scope.lastTradeTime = quote.LastTradeTime;
                $scope.lastTradePriceOnly = quote.LastTradePriceOnly;
            });
        };
        getQuote($scope.ticker.tick.name);
        $scope.getQuote = getQuote;
        //
        var getNews = function(symbol) {
            // Need to resolve CORS issue before using x2js library:
        };
        getNews($scope.ticker.tick.name);
    }]
);

// This controller is used in trace.html.
// Duty: gather all the ones of the same forecast from the archive in the portfolio.
/*
YouTiming.controller('Trace', ['$scope', '$routeParams', 'yang', 'yin', 'pageScroll', 
    'yangPageActiveClass', 'yinPageActiveClass', 'tickerPerPage', 'modeldir', 'portfname', 
    'histdir', 'arcfname', 'clicklist', 'clickpage', 'getData', 'guidance', 'miss', 
    function($scope, $routeParams, yang, yin, pageScroll, yangPageActiveClass, 
        yinPageActiveClass, tickerPerPage, modeldir, portfname, histdir, arcfname, 
        clicklist, clickpage, getData, guidance, miss) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        //
        $scope.getTracePageClass = function(type, page) {
            switch(type) {
                case yang: return $scope.yangTraceSP == page ? yangPageActiveClass : '';
                case yin: return $scope.yinTraceSP == page ? yinPageActiveClass : '';
                default: alert('Error: Trace, 001');
            }
        };
        //
        $scope.selectTracePage = function(from, type, index) {
            var page = 0;
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            var position = null;
            switch(type) {
                case yang:
                    position = 'tracepos';
                    $scope.yangTraceSP = page;
                    break;
                case yin:
                    position = 'traceneg';
                    $scope.yinTraceSP = page;
                    break;
                default: alert('Error: Trace, 002');
            }
            // 2015-01-27: This guy didn't work in Trace. Come back later.
            //pageScroll.page(position);
        };
        //
        $scope.yangTraceSP = 1;
        $scope.yinTraceSP = 1;
        $scope.trace = {};
        $scope.trace.tickers = [];
        $scope.trace.yang_doors = 0;
        $scope.trace.yin_doors = 0;
        $scope.trace.fore = null; // the forecast code to be found
        $scope.trace.error = null;
        $scope.predicate = 'door.dat1';
        $scope.reverse = true;
        $scope.guidance = guidance;
        $scope.miss = miss;
        // 1. try to get the forecast code from the archive
        $scope.trace.fore = $routeParams.fore;
        $scope.trace.type = $routeParams.type;
        if(!$scope.trace.fore) { console.log('Error: Trace, 001'); return; }
        // 3. serach each archived ticker and find the same forecast
        //$http.get(histdir + arcfname)
        getData.getJSON(histdir + arcfname)
        .success(function(response, status, headers, config) {
            var tlist = response, idx = 0;
            for(var i = 0, len = tlist.length; i < len; ++i) {
                if($scope.trace.fore == tlist[i].door.fore &&
                    $scope.trace.type == tlist[i].door.type) {
                    // match the forecast code in the archive.json
                    var x = tlist[i]; //, netp = '';
                    var pri1 = parseFloat(x.door.pri1);
                    var pri2 = parseFloat(x.sess.pri2);
                    switch(x.door.type) {
                        case yang:
                            if(pri2 <= pri1) pri2 = undefined; 
                            break;
                        case yin:
                            if(pri2 >= pri1) pri2 = undefined;
                            break;
                    }
                    //
                    if(pri2 === undefined) { x.sess.dat2 = 'n/a'; x.sess.pri2 = 'n/a'; }
                    $scope.trace.tickers[idx] = x;
                    switch(x.door.type) {
                        case yang:
                            ++$scope.trace.yang_doors;
                            break;
                        case yin:
                            ++$scope.trace.yin_doors;
                            break;

                    }
                    //if(pri2) netp = (100 * (pri2 - pri1) / pri1).toFixed(1) + '%';
                    //$scope.trace.tickers[idx].sess.netp = netp;
                    ++idx;
                }
            }
            //
            for(var i = 0, len = $scope.trace.tickers.length; i < len; ++i) {
                $scope.trace.tickers[i].tick.sequ = i + 1;
            }
        })
        .error(function(response, status, headers, config) {
            $scope.trace.error = status;
            console.log('Error: Trace, 002')
        });
    }]
);
*/
