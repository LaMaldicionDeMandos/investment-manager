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
                    rows.push({
                        c:[{v: 10 - i},
                            {v: title.history[i].percentBeforeOpen()},
                            {v: title.history[i+title.index-1].percentBeforeOpen()}
                        ]
                    });
                }
                rows.push({c:[{v:11}, {}, {v: title.history[title.index].percentBeforeOpen()}]})
                $scope.chartPrediction.data.rows = rows;
            };
            $scope.chartObject = {};
            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = true;
            $scope.chartObject.data = {
                "cols": [{
                    id: "error",
                    label: "Error",
                    type: "number"
                }, {
                    id: "count",
                    type: "number"
                }],
                "rows": []
            };
            $scope.chartObject.options = {
                "colors": ['#0000FF'],
                "defaultColors": ['#0000FF'],
                "isStacked": "false",
                "fill": 0,
                "displayExactValues": false,
                "vAxis": {
                    "title": "Ocurrencias",
                    "gridlines": {
                        "count": 6
                    }
                }
            };
            $scope.chartObject.view = {
                columns: [0, 1]
            };

            $scope.chartPrediction = {};
            $scope.chartPrediction.type = "LineChart";
            $scope.chartPrediction.displayed = true;
            $scope.chartPrediction.data = {
                "cols": [{
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
                }],
                "rows": [{c:[{v: 1}, {v:0}, {v:2}]},
                    {c:[{v: 2}, {v:1}, {v:2}]},
                    {c:[{v: 3}, {v:2}, {v:3}]},
                    {c:[{v: 4}, {v:2}, {v:3}]},
                    {c:[{v: 5}, {v:1}, {v:2}]},
                    {c:[{v: 6}, {v:1}, {v:3}]},
                    {c:[{v: 7}, {v:0}, {v:4}]}
                ]
            };
            $scope.chartPrediction.options = {
                "colors": ['#0000FF', '#00FF00'],
                "defaultColors": ['#0000FF'],
                "isStacked": "false",
                "fill": 0,
                "displayExactValues": false,
                "vAxis": {
                    "title": "Ganancia",
                    "gridlines": {
                        "count": 6
                    }
                }
            };
            $scope.chartPrediction.view = {
                columns: [0, 1, 2]
            };
        })
        .controller('statisticsController', function($scope, titlesService) {
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
                    var value = {
                        c:[{v: title.history[i].date},
                            {v: title.history[i].percentMax()},
                            {v: title.history[i].percentMin()},
                            {v: title.history[i].percentBeforeOpen()},
                        ]
                    }
                    rowsFull.push(value);
                    if (i < 100) { rowsLast.push(value);}

                }
                $scope.chartFull.data.rows = rowsFull;
                $scope.chartLast.data.rows = rowsLast;
            };
            $scope.populateExtreme = function(title) {
                var rows = [];
                title.extremes.forEach(function(extreme) {
                   var min = {c:[{v: [extreme.min.hour, extreme.min.minute]}, {v: extreme.min.percent}]};
                   var max = {c:[{v: [extreme.max.hour, extreme.max.minute]}, null, {v: extreme.max.percent}]};
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
                        console.log('History from statistics');
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
            $scope.chartFull = {};
            $scope.chartFull.type = "LineChart";
            $scope.chartFull.displayed = true;
            $scope.chartFull.data = {
                "cols": [{
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
                }],
                "rows": []
            };
            $scope.chartFull.options = {
                "colors": ['#00ff00', '#ff0000', '#0000ff'],
                "defaultColors": ['#0000FF'],
                "isStacked": "false",
                "fill": 0,
                "displayExactValues": false,
                "vAxis": {
                    "title": "Historial",
                    "gridlines": {
                        "count": 6
                    }
                }
            };
            $scope.chartFull.view = {
                columns: [0, 1, 2, 3]
            };
            $scope.chartLast = {};
            $scope.chartLast.type = "LineChart";
            $scope.chartLast.displayed = true;
            $scope.chartLast.data = {
                "cols": [{
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
                }],
                "rows": []
            };
            $scope.chartLast.options = {
                "colors": ['#00ff00', '#ff0000', '#0000ff'],
                "defaultColors": ['#0000FF'],
                "isStacked": "false",
                "fill": 0,
                "displayExactValues": false,
                "vAxis": {
                    "title": "Historial",
                    "gridlines": {
                        "count": 6
                    }
                }
            };
            $scope.chartLast.view = {
                columns: [0, 1, 2, 3]
            };

            $scope.chartDays = {};
            $scope.chartDays.type = "ScatterChart";
            $scope.chartDays.displayed = true;
            $scope.chartDays.data = {
                "cols": [{
                    id: "hous",
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
                }],
                "rows": []
            };
            $scope.chartDays.options = {
                "colors": ['#ff0000', '#00aa00'],
                "defaultColors": ['#0000FF'],
                "isStacked": "false",
                "pointSize": 1,
                "fill": 0,
                "displayExactValues": false,
                "vAxis": {
                    "title": "Intra diario",
                    "gridlines": {
                        "count": 6
                    }
                }
            };
            $scope.chartDays.view = {
                columns: [0, 1, 2]
            };
        })
})();