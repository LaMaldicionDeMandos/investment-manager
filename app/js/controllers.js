/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('menuController', function($scope) {
            $scope.menu = {isOpen: false, hover: false};
            $scope.openMenu = function(mustOpen) {
                $scope.menu.isOpen = mustOpen;
            };
        })
        .controller('predictionsController', function($scope, $mdSidenav, titlesService) {
            $scope.view = 'prediction';
            $scope.windowMethod = true;
            $scope.regressionMethod = false;
            $scope.selectWindowMethod = function() {
                $scope.windowMethod = true;
                $scope.regressionMethod = false;
            };
            $scope.selectRegressionMethod = function() {
                $scope.windowMethod = false;
                $scope.regressionMethod = true;
            };
            $scope.selectView = function(view) {
              $scope.view = view;
            };
            $scope.open = function() {
                $mdSidenav($scope.view)
                    .toggle()
                    .then(function () {
                        console.log("toggle  is done");
                    });
            };

            $scope.populateTitle = function(title) {
                var historyPromise;
                var extremePromise;
                console.log('Populating title: ' + title.name);
                if (!title.history) {
                    console.log('Fetching history title: ' + title.name);
                    historyPromise = titlesService.findHistory(title).then(function (history) {
                        console.log('History from main');
                        title.populate(history);
                    });
                }
                if (!title.extremes) {
                    extremePromise = titlesService.findExtremes(title).then(function (extremes) {
                        console.log('Extremes from main');
                        title.extremes = extremes;
                    });
                }
                return {title: title, historyPromise: historyPromise, extremePromise: extremePromise};
            };

            $scope.selectTitle = function(title) {
                $scope.currentTitle = title;
                var result = $scope.populateTitle(title);
                $scope.$broadcast('currentTitleEvent', result);
            };

            titlesService.all().then(
                function(titles) {
                    $scope.titles = titles.map(function(title) {
                        var theTitle = new Title(title);
                        $scope.populateTitle(theTitle);
                        return theTitle;
                    });
                    $scope.$broadcast('arriveTitlesEvent', $scope.titles);
                },  function(error) {
                    console.log(error);
                }
            );
        })
        .controller('regressionTableController', function($scope) {
            var compareByName = function(a, b) {
                return a.name > b.name ? 1 : -1;
            };

            var compareByClosing = function(a, b) {
                return a.closingPercent < b.closingPercent
                    ? 1 : -1;
            };

            var compareByJump = function(a, b) {
                return a.jumpPercent < b.jumpPercent
                    ? 1 : -1;
            };

            var compareByDiff = function(a, b) {
                return a.totalPercent < b.totalPercent
                    ? 1 : -1;
            };

            $scope.sortByName = function() {
                $scope.sorterBy = 'name';
                $scope.titles.sort(compareByName);
            };

            $scope.sortByClose = function() {
                $scope.sorterBy = 'close';
                $scope.titles.sort(compareByClosing);
            };

            $scope.sortByJump = function() {
                $scope.sorterBy = 'jump';
                $scope.titles.sort(compareByJump);
            };

            $scope.sortByDiff = function() {
                $scope.sorterBy = 'diff';
                $scope.titles.sort(compareByDiff);
            };

            $scope.sorterBy;

            $scope.$on('arriveTitlesEvent', function( event, titles) {
                $scope.titles = titles;
                $scope.titles.sort(compareByName);
            });
        })
        .controller('windowTableController', function($scope) {
            $scope.globalAfterPercent = 90;
            $scope.globalBeforePercent = 90;

            var compareByName = function(a, b) {
                return a.name > b.name ? 1 : -1;
            };
            var compareByBefore = function(a, b) {
                return a.before < b.before
                    ? 1 : -1;
            };
            var compareByAfter = function(a, b) {
                return a.after < b.after
                    ? 1 : -1;
            };

            $scope.sortByName = function() {
                $scope.sorterBy = 'name';
                $scope.titles.sort(compareByName);
            };
            $scope.sortByBefore = function() {
                $scope.sorterBy = 'before';
                $scope.titles.sort(compareByBefore);
            };
            $scope.sortByAfter = function() {
                $scope.sorterBy = 'after';
                $scope.titles.sort(compareByAfter);
            };
            $scope.sorterBy = '';

            $scope.changeAllMaxAndMinBefore = function(percent) {
                $scope.titles.forEach(function(title) {
                    title.changeMaxAndMinBefore(percent);
                });
            };
            $scope.changeAllMaxAndMinAfter = function(percent) {
                $scope.titles.forEach(function(title) {
                    title.changeMaxAndMinAfter(percent);
                });
            };
            $scope.$on('arriveTitlesEvent', function( event, titles) {
                $scope.titles = titles;
            });
        })
        .controller('predictionController', function($scope) {
            $scope.errorPercent = 90;
            $scope.current = undefined;

            $scope.changeErrorPercent = function(title, percent) {
                var values = title.changeErrorPercent(percent);
                $scope.chartObject.data.rows = values;
            };

            $scope.$on('currentTitleEvent', function( event, data) {
                var title = data.title;
                $scope.current = title;
                var values = title.changeErrorPercent($scope.errorPercent);
                $scope.chartObject.data.rows = values;
                if (title.history) {
                    populateWindow(title);
                } else {
                    data.historyPromise.then(function(history) {
                        console.log('History from prediction');
                        populateWindow(title);
                    });
                }
            });

            var populateWindow = function(title) {
                var rows = [];
                for(var i = 9;i>=0;i--) {
                    rows.push(Chart.createRow([
                        10 - i,
                        title.history[i].percentBeforeOpen(),
                        title.history[i+title.index-1].percentBeforeOpen()
                        ]));
                }
                rows.push(Chart.createRow([11, null, title.history[title.index].percentBeforeOpen()]));
                $scope.chartPrediction.data.rows = rows;
            };
            $scope.chartObject = new Chart(Chart.Type.LINE, [{
                    id: "error",
                    label: "Error",
                    type: "number"
                }, {
                    id: "count",
                    type: "number"
                }]);

            $scope.chartObject.options.vAxis.title = 'Ocurrencias';

            $scope.chartPrediction = new Chart(Chart.Type.LINE, [{
                    id: "date",
                    label: "Día",
                    type: "number"
                }, {
                    id: "percentReal",
                    label: "Real",
                    type: "number"
                }, {
                    id: "percentEstimated",
                    label: "Estimado",
                    type: "number"
                }], ['#0000FF', '#00FF00']);
            $scope.chartPrediction.options.vAxis.title = 'Ganancia';
        })
        .controller('extremesController', function($scope) {
            $scope.current = undefined;
            $scope.limitPercent = 90;
            $scope.changeLimitPercent = function() {
                $scope.current.minLimit = $scope.current.history.slice().sort(function(a,b) {
                    return a.percentMin() - b.percentMin();
                }).slice($scope.current.history.length*(100 - $scope.limitPercent)/100)[0].percentMin();
                $scope.current.maxLimit = $scope.current.history.slice().sort(function(a,b) {
                    return b.percentMax() - a.percentMax();
                }).slice($scope.current.history.length*(100 - $scope.limitPercent)/100)[0].percentMax();
            }
            $scope.populate = function(title) {
                var rowsFull = [];
                var rowsLast = [];
                for(var i = title.history.length - 1;i>=0;i--) {
                    var value = Chart.createRow([
                        title.history[i].date,
                        title.history[i].percentMax(),
                        title.history[i].percentMin(),
                        title.history[i].percentBeforeOpen()
                        ]);
                    rowsFull.push(value);
                    if (i < 100) { rowsLast.push(value);}

                }
                $scope.chartFull.data.rows = rowsFull;
                $scope.chartLast.data.rows = rowsLast;
            };
            $scope.populateExtreme = function(title) {
                var rows = [];
                title.extremes.forEach(function(extreme) {
                   var min = Chart.createRow([
                       [extreme.min.hour, extreme.min.minute, 0],
                       extreme.min.percent]);
                   var max = Chart.createRow([
                       [extreme.max.hour, extreme.max.minute, 0],
                       null,
                       extreme.max.percent]);
                   rows.push(min, max);
                });
                $scope.chartDays.data.rows = rows;
            };
            $scope.$on('currentTitleEvent', function( event, data) {
                $scope.current = data.title;
                if (data.title.history) {
                    $scope.populate(data.title);
                } else {
                    data.historyPromise.then(function(history) {
                        console.log('History from extremes');
                        var minEqualClose = data.title.history.filter(function(item) {
                            return item.min == item.closing;
                        }).length;
                        var maxEqualClose = data.title.history.filter(function(item) {
                            return item.max == item.closing;
                        }).length;
                        $scope.current.minDiference = data.title.history.map(function(item) {
                           return item.percentBeforeOpen() - item.percentMin();
                        }).reduce(function(last, actual) {
                            return last + actual;
                        })/data.title.history.length;
                        $scope.current.maxDiference = data.title.history.map(function(item) {
                                return item.percentMax() - item.percentBeforeOpen();
                            }).reduce(function(last, actual) {
                                return last + actual;
                            })/data.title.history.length;
                        $scope.changeLimitPercent();
                        $scope.current.minEqualClosePercent = 100*minEqualClose/data.title.history.length;
                        $scope.current.maxEqualClosePercent = 100*maxEqualClose/data.title.history.length;
                        $scope.populate(data.title);
                    });
                }
                if (data.title.extremes) {
                    $scope.populateExtreme(data.title);
                } else {
                    data.extremePromise.then(function(extremes) {
                        $scope.populateExtreme(data.title);
                    });
                }

            });
            $scope.chartFull = new Chart(Chart.Type.LINE, [{
                    id: "date",
                    label: "Fecha",
                    type: "string"
                }, {
                    id: "max",
                    label: "Máximo",
                    type: "number"
                }, {
                    id: "min",
                    label: "Mínimo",
                    type: "number"
                }, {
                    id: "close",
                    label: "Cierre",
                    type: "number"
                }], ['#00ff00', '#ff0000', '#0000ff']);
            $scope.chartFull.options.vAxis.title = 'Historial';
            $scope.chartLast = new Chart(Chart.Type.LINE, [{
                    id: "date",
                    label: "Fecha",
                    type: "string"
                }, {
                    id: "max",
                    label: "Máximo",
                    type: "number"
                }, {
                    id: "min",
                    label: "Mínimo",
                    type: "number"
                }, {
                    id: "close",
                    label: "Cierre",
                    type: "number"
                }], ['#00ff00', '#ff0000', '#0000ff']);
            $scope.chartLast.options.vAxis.title = 'Historial';

            $scope.chartDays = new Chart(Chart.Type.SCATTER, [{
                    id: "hours",
                    label: "Hora",
                    type: "timeofday"
                }, {
                    id: "min",
                    label: "Mínimo",
                    type: "number"
                }, {
                    id: "max",
                    label: "Máximo",
                    type: "number"
                }], ['#ff0000', '#00aa00']);
            $scope.chartDays.options.pointSize = 1;
            $scope.chartDays.options.hAxis = {gridlines: {count: 20}};
            $scope.chartDays.options.vAxis.title = 'Intradiario';
        })
        .controller('statisticsController', function($scope) {
            $scope.current = undefined;
            $scope.regretionSize = 31;
            $scope.recalculateRegression = function() {
                $scope.current.calculateRegression($scope.regretionSize);
                $scope.populate($scope.current);
            }
            $scope.populate = function(title) {
                var rows = [];
                var size = $scope.regretionSize;
                for(var i = size - 1 ;i>=0;i--) {
                    var j = size - i - 1;
                    var closing = Chart.createRow([j, null, title.history[i].closing]);
                    var opening = Chart.createRow([j, title.history[i].opening]);
                    rows.push(opening, closing);
                }
                $scope.chartRegretion.data.rows = rows;
            };
            $scope.$on('currentTitleEvent', function( event, data) {
                $scope.current = data.title;
                if (data.title.history) {
                    $scope.recalculateRegression();
                } else {
                    data.historyPromise.then(function(history) {
                        $scope.recalculateRegression();
                    });
                }
            });

            $scope.chartRegretion = new Chart(Chart.Type.SCATTER, [{
                    id: "date",
                    label: "Día",
                    type: "number"
                }, {
                    id: "opening",
                    label: "Apertura",
                    type: "number"
                }, {
                    id: "closing",
                    label: "Cierre",
                    type: "number"
                }], ['#00aa00', '#0000aa']);
            $scope.chartRegretion.options.pointSize = 2;
            $scope.chartRegretion.options.trendlines = {
                    0: {"type": 'polynomial', "degree": 1},
                    1: {"type": 'polynomial', "degree": 1}}
            $scope.chartRegretion.options.hAxis = {gridlines: {count: 20}},
            $scope.chartRegretion.options.vAxis.title = "Regreción";
        })
        .controller('inclineController', function($scope) {
            $scope.$on('currentTitleEvent', function( event, data) {
                $scope.current = data.title;
            });
        })
        .controller('dailyController', function($scope, titlesService) {
            $scope.current = undefined;

            var populate = function(title) {

                $scope.chartDaily = new Chart(Chart.Type.LINE, undefined, ['#00abbd', '#055499', '#132241', '#c3c3c3', '#ff5a00', '#e91365', '#ff921f', '#cc0000', '#4d5766', '#98dde4']);
                var cols = [{
                    id: "hour",
                    label: "Hora",
                    type: "timeofday"
                }];
                var values = {};
                for(var i = 0; i<3; i++) {
                    cols.push({id: i, label: 'Day ' + i,type: 'number'});
                    var day = $scope.current.dailyList[i];
                    day.forEach(function(movement) {
                        var date = new Date(movement.dateTime);
                        var hour = date.getHours() > 18 ? 8 : date.getHours();
                        var minute = date.getMinutes();
                        var second = date.getSeconds();
                        if (!values[hour]) values[hour] = {};
                        if (!values[hour][minute]) values[hour][minute] = {};
                        if (!values[hour][minute][second]) {
                            values[hour][minute][second] = [];
                            for (var j = 0; j < i; j++) {
                                values[hour][minute][second].push(null);
                            }
                        }
                        values[hour][minute][second].push(movement.value);
                    });
                }
                $scope.chartDaily.data.cols = cols;
                var rows = [];
                for (var hour in values) {
                    for (var minute in values[hour]) {
                        for (var second in values[hour][minute]) {
                            values[hour][minute][second].unshift([parseInt(hour), parseInt(minute), parseInt(second)]);
                            rows.push(Chart.createRow(values[hour][minute][second]));
                        }
                    }
                }
                $scope.chartDaily.data.rows = rows;
                $scope.chartDaily.options.vAxis.title = 'Diario';
                $scope.chartDaily.options.interpolateNulls = true;
                var colsToShow = [];
                for (var i = 0; i <= 3;i++) {
                    colsToShow.push(i);
                }
                $scope.chartDaily.view = {columns: colsToShow};
            };
            $scope.$on('currentTitleEvent', function( event, data) {
                $scope.current = data.title;
                if (!$scope.current.dailyList) {
                   $scope.current.dailyList = titlesService.dailyData($scope.current.name, 3);
                }
                populate($scope.current);
            });
        })
})();