// This is the init controller used in index.html whose
// main view is app1.html. This guy only gets executed once.
// Duty: GET active.json (portfolio).
// Code: 0 - init app, 1 - portfolio app, 2 - archive app
YouTiming.controller('App0', ['$scope', 'yang', 'yin', 'modeldir', 
    'weekfname', 'portfname', 'tickerPerPage', 'getData', 
    function($scope, yang, yin, modeldir, weekfname, portfname,
        tickerPerPage, getData) {
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
            $scope.yangSP1 = 1; // user selected page on app1.html view
        }
        if(!$scope.yinSP1) {
            $scope.yinSP1 = 1;
        }
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
                        if(pri2) $scope.portf.tickers1[i].sess.netp = (100*(pri2-pri1)/pri1).toFixed(1) + '%';
                        ++$scope.yang_doors1;
                        break;
                    case yin:
                        if(pri2) $scope.portf.tickers1[i].sess.netp = (100*(pri2-pri1)/pri1).toFixed(1) + '%';
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

// This controller is used in app1.html which is the main view of index.html.
// Duty: when the index.html firstly gets loaded, this guy doesn't do anything;
//       it is mainly responsible for pagination if ther user clicks.
YouTiming.controller('App1', ['$scope', 'yang', 'yin',
    'yangPageActiveClass', 'yinPageActiveClass', 'tickerPerPage', 
    'clicklist', 'clickpage', 'pageHash',
    function($scope, yang, yin, yangPageActiveClass, yinPageActiveClass,
        tickerPerPage, clicklist, clickpage, pageHash) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        // restore the previously clicked page # from the service singleton
        var cpage = pageHash.get('App1', yang, yang);  // the 3rd par is passed and used as a constant
        if(cpage !== undefined) $scope.yangSP1 = cpage;
        cpage = pageHash.get('App1', yin, yang);
        if(cpage !== undefined) $scope.yinSP1 = cpage;
        //
        $scope.abs = function(fval) {
            return Math.abs(fval);
        }
        //
        $scope.average = function(f1, f2) {
            if(f1 == "n/a") f1 = 0;
            if(f2 == "n/a") f2 = 0;
            var v1 = parseFloat(f1), v2 = parseFloat(f2);
            if(v1 == 0) return v2;
            if(v2 == 0) return v1;
            return (v1 + v2) / 2;
        }
        //
        $scope.getColor = function(door) {
            if(door == 'yang') return "blue";
            else return "red";
        }
        //
        $scope.getSP1Class = function(type, page) {
            switch(type) {
                case yang:
                    return $scope.yangSP1 == page ? yangPageActiveClass : '';
                case yin:
                    return $scope.yinSP1 == page ? yinPageActiveClass : '';
                default: alert('Error: App2, 001');
            }
        };
        //
        $scope.roundup = function(fval, iprecision) {
            return Math.round(parseFloat(fval) * Math.pow(10, iprecision)) / Math.pow(10, iprecision);
        }
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
            pageHash.put('App1', type, page, yang); // store the clicked page # into the service singleton
            //
            switch(type) {
                case yang:
                    $scope.yangSP1 = page;
                    break;
                case yin: 
                    $scope.yinSP1 = page;
                    break;
                default: alert('Error: App2, 002');
            }
        };
    }]
);

// This controller is used in app2.html, the archive page.
// Duty: to GET single ticker's historical JSON data.
YouTiming.controller('App2', ['$scope', '$routeParams', 'yang', 'yin',
    'yangPageActiveClass', 'yinPageActiveClass', 'tickerPerPage', 
    'histdir', 'clicklist', 'clickpage', 'pageHash', 'getData',
    function($scope, $routeParams, yang, yin,
        yangPageActiveClass, yinPageActiveClass, tickerPerPage, 
        histdir, clicklist, clickpage, pageHash, getData) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        // restore the previously clicked page # from the service singleton
        var cpage = pageHash.get('App2', yang, yang);  // the 3rd par is passed and used as a constant
        if(cpage !== undefined) $scope.yangSP2 = cpage;
        cpage = pageHash.get('App2', yin, yang);
        if(cpage !== undefined) $scope.yinSP2 = cpage;
        //
        $scope.getSP2Class = function(type, page) {
            switch(type) {
                case yang: return $scope.yangSP2 == page ? yangPageActiveClass : '';
                case yin: return $scope.yinSP2 == page ? yinPageActiveClass : '';
                default: alert('Error: App2, 001');
            }
        };
        //
        $scope.selectSP21 = function(from, type, index) {
            var page = 0;
            switch(type) {
                case yang:
                    index -= $scope.page2_index_cutoff[index-1];
                    break;
                case yin: 
                    index -= $scope.page2_index_cutoff[index-1];
                    break;
                default: alert('Error: App2, 002');
            }
            //
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            pageHash.put('App2', type, page, yang);
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
        $scope.selectSP22 = function(from, type, index) {
            var page = 0;
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            //
            pageHash.put('App2', type, page, yang); // store the clicked page # into the service singleton
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
            $scope.page2_index_cutoff = [];
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
                        default: alert("Error: App2, 003"); break;
                    }
                    if(pri2 === undefined) {
                        $scope.portf.tickers2[i].sess.dat2 = 'n/a';
                        $scope.portf.tickers2[i].sess.pri2 = 'n/a';
                    }
                    //
                    switch($scope.portf.tickers2[i].door.type) {
                        case yang:
                            if(pri2) $scope.portf.tickers2[i].sess.netp = (100*(pri2-pri1)/pri1).toFixed(1) + '%';
                            ++$scope.yang_doors2;
                            $scope.page2_index_cutoff[idx++] = $scope.yin_doors2;
                            break;
                        case yin:
                            if(pri2) $scope.portf.tickers2[i].sess.netp = (100*(pri2-pri1)/pri1).toFixed(1) + '%';
                            ++$scope.yin_doors2;
                            $scope.page2_index_cutoff[idx++] = $scope.yang_doors2;
                            break;
                        default: alert("Error: App2, 003"); break;
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
                console.log('Error: App2, 004')
            });
            //
            if(!$scope.yangSP2) $scope.yangSP2 = 1; // user selected page on app1.html view
            if(!$scope.yinSP2) $scope.yinSP2 = 1;
            $scope.archive = true;
        }
    }]
);

// This controller is used in flock.html.
// Duty: gather all the ones of the same forecast from the archive in the portfolio.
YouTiming.controller('Flock', ['$scope', '$routeParams', 'yang', 'yin', 
    'yangPageActiveClass', 'yinPageActiveClass', 'tickerPerPage', 'modeldir',
    'portfname', 'histdir', 'arcfname', 'clicklist', 'clickpage', 'getData',
    function($scope, $routeParams, yang, yin, 
        yangPageActiveClass, yinPageActiveClass, tickerPerPage, modeldir,
        portfname, histdir, arcfname, clicklist, clickpage, getData) {
        //
        $scope.clicklist = clicklist;
        $scope.clickpage = clickpage;
        //
        $scope.getFlockPageClass = function(type, page) {
            switch(type) {
                case yang: return $scope.yangFlockSP == page ? yangPageActiveClass : '';
                case yin: return $scope.yinFlockSP == page ? yinPageActiveClass : '';
                default: alert('Error: Flock, 001');
            }
        };
        //
        $scope.selectFlockPage = function(from, type, index) {
            var page = 0;
            if(from == clicklist) {
                var num = parseInt(index);
                var page = Math.floor(num / tickerPerPage);
                if(num % tickerPerPage != 0) ++page;
            }
            else page = index;
            switch(type) {
                case yang:
                    $scope.yangFlockSP = page;
                    break;
                case yin: 
                    $scope.yinFlockSP = page;
                    break;
                default: alert('Error: Flock, 002');
            }
        };
        //
        $scope.yangFlockSP = 1;
        $scope.yinFlockSP = 1;
        //
        $scope.flock = {};
        $scope.flock.tickers = [];
        $scope.flock.yang_doors = 0;
        $scope.flock.yin_doors = 0;
        $scope.flock.ticker = null; // ticker rounted
        $scope.flock.dat1 = null; // dat1 routed
        $scope.flock.fore = null; // the forecast code to be found
        $scope.flock.tnames = []; // all ticker names from the portfolio
        $scope.flock.error = null;
        $scope.predicate = 'door.dat1';
        $scope.reverse = true;
        // 1. try to get the forecast code from the archive
        $scope.flock.ticker = $routeParams.ticker;
        $scope.flock.dat1 = $routeParams.dat1;
        //$http.get(histdir + $scope.flock.ticker + '.json')
        getData.getJSON(histdir + $scope.flock.ticker + '.json')
        .success(function(response, status, headers, config) {
            var tlist = response;
            for(var i = 0, len = tlist.length; i < len; ++i) {
                if(tlist[i].door.dat1 == $scope.flock.dat1) {
                    $scope.flock.fore = tlist[i].door.fore;
                    break;
                }
            }
            // 2. get all the ticker-names from the portfolio
            //$http.get(modeldir + portfname)
            getData.getJSON(modeldir + portfname)
            .success(function(response, status, headers, config) {
                var tlist = response;
                for(var i = 0, len = tlist.length; i < len; ++i) {
                    $scope.flock.tnames[i] = tlist[i].tick.name; // store all the tickers
                    if(!$scope.flock.fore) {
                        // if fore not found in archive, user must click from home
                        if(tlist[i].tick.name == $scope.flock.ticker && 
                            tlist[i].door.dat1 == $scope.flock.dat1) {
                            $scope.flock.fore = tlist[i].door.fore;
                        }
                    }
                }
                if(!$scope.flock.fore) { console.log('Error: Flock, 003'); return; }
                // 3. serach each archived ticker and find the same forecast
                //$http.get(histdir + arcfname)
                getData.getJSON(histdir + arcfname)
                .success(function(response, status, headers, config) {
                    var tlist = response, idx = 0;
                    for(var i = 0, len = tlist.length; i < len; ++i) {
                        if($scope.flock.fore == tlist[i].door.fore) {
                            // match the forecast code in the archive.json
                            var x = tlist[i], netp = '';
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
                            $scope.flock.tickers[idx] = x;
                            switch(x.door.type) {
                                case yang:
                                    ++$scope.flock.yang_doors;
                                    break;
                                case yin:
                                    ++$scope.flock.yin_doors;
                                    break;

                            }
                            if(pri2) netp = (100 * (pri2 - pri1) / pri1).toFixed(1) + '%';
                            $scope.flock.tickers[idx].sess.netp = netp;
                            ++idx;
                        }
                    }
                    //
                    for(var i = 0, len = $scope.flock.tickers.length; i < len; ++i) {
                        $scope.flock.tickers[i].tick.sequ = i + 1;
                    }
                })
                .error(function(response, status, headers, config) {
                    $scope.flock.error = status;
                    console.log('Error: Flock, 004')
                });
            })
            .error(function(response, status, headers, config) {
                $scope.flock.error = status;
                console.log('Error: Flock, 005')
            });
        })
        .error(function(response, status, headers, config) {
            $scope.flock.error = status;
            console.log('Error: Flock, 006')
            return;
        });
    }]
);

// Get stock quote in home.html.
YouTiming.controller('StockQuote', ['$scope', 'getData',
    function($scope, getData) {
        /*
        var api = getData.getQuote($scope.ticker.tick.name);
        var data = api.get({symbol:$scope.ticker.tick.name}, function() {
            var quote = data.query.results.quote;
            $scope.lang = data.query.lang;
            $scope.lastTradeDate = quote.LastTradeDate;
            $scope.lastTradeTime = quote.LastTradeTime;
            $scope.lastTradePriceOnly = quote.LastTradePriceOnly;
        });
        */
        function getQuote(symbol) {
            var api = getData.getQuote(symbol);
            if(api == null) return;
            var data = api.get({symbol:symbol}, function() {
                var quote = data.query.results.quote;
                $scope.lang = data.query.lang;
                $scope.lastTradeDate = quote.LastTradeDate;
                $scope.lastTradeTime = quote.LastTradeTime;
                $scope.lastTradePriceOnly = quote.LastTradePriceOnly;
            });
        }
        //
        getQuote($scope.ticker.tick.name);
        //
        $scope.getQuote = getQuote;
    }]
);
