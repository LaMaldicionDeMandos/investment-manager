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

            $scope.selectTitle = function(title) {
                $scope.currentTitle = title;
                var historyPromise;
                var extremePromise;
                if (!title.history) {
                    historyPromise = titlesService.findHistory(title).then(function (history) {
                        console.log('History from main');
                        title.history = history;
                    });
                }
                if (!title.extremes) {
                    extremePromise = titlesService.findExtremes(title).then(function (extremes) {
                        console.log('Extremes from main');
                        title.extremes = extremes;
                    });
                }
                $scope.$broadcast('currentTitleEvent',
                    {title: title, historyPromise: historyPromise, extremePromise: extremePromise});
            };
        })
        .controller('tableController', function($scope, titlesService) {
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
            $scope.sorterBy = 'name';

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

            titlesService.all().then(
                function(titles) {
                    $scope.titles = titles.map(function(title) {
                        return new Title(title);
                    });
                    $scope.titles.sort(compareByName);
                },  function(error) {
                    console.log(error);
                }
            );
        })
        .controller('predictionController', function($scope, titlesService) {
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
            $scope.closingNextValue = 0;
            $scope.closingLastValue = 0;
            $scope.openingNextValue = 0;
            $scope.openingLastValue = 0;
            var regretion = function(size, target, attr) {
                var sx = 0;
                var sy = 0;
                var sxx = 0;
                var sxy = 0;
                var syy = 0;
                for(var i = size - 1 ;i>=0;i--) {
                    var j = size - i - 1;
                    sx+= j;
                    sy+= target[i][attr];
                    sxx+= j*j;
                    sxy+= j*target[i][attr];
                    syy+= target[i][attr]*target[i][attr];
                }
                var b = (size*sxy - sx*sy)/(size*sxx - sx*sx);
                var a = (sy - b*sx)/size;
                return function(x) {
                    return a + b*x;
                };
            };
            $scope.populate = function(title) {
                var rows = [];
                var size = 31;
                for(var i = size - 1 ;i>=0;i--) {
                    var j = size - i - 1;
                    var closing = Chart.createRow([j, null, title.history[i].closing]);
                    var opening = Chart.createRow([j, title.history[i].opening]);
                    rows.push(opening, closing);
                }
                var cRegretion = regretion(size, title.history, 'closing');
                var oRegretion = regretion(size, title.history, 'opening');

                $scope.closingNextValue = cRegretion(31);
                $scope.closingLastValue = title.history[0].closing;
                $scope.closingPercent = 100*($scope.closingNextValue - $scope.closingLastValue)/$scope.closingLastValue;
                $scope.openingNextValue = oRegretion(31);
                $scope.openingLastValue = title.history[0].opening;
                $scope.totalPercent = 100*($scope.closingNextValue - $scope.openingNextValue)/$scope.openingNextValue;
                $scope.jumpPercent = 100*($scope.openingNextValue - $scope.closingLastValue)/$scope.closingLastValue;
                $scope.chartRegretion.data.rows = rows;
            };
            $scope.$on('currentTitleEvent', function( event, data) {
                $scope.current = data.title;
                if (data.title.history) {
                    $scope.populate(data.title);
                } else {
                    data.historyPromise.then(function(history) {
                        $scope.populate(data.title);
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
})();