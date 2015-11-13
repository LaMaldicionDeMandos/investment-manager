/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('predictionsController', function($scope, $mdSidenav, titlesService) {
            $scope.errorPercent = 90;
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

            $scope.open = function() {
                $mdSidenav('right')
                    .toggle()
                    .then(function () {
                        console.log("toggle  is done");
                    });
            }
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
                        var report = {
                            id: title._id,
                            index: title.windowReports[0].report.predictionBefore.index,
                            name: title.name,
                            after: title.windowReports[0].report.predictionBefore.after,
                            before: title.windowReports[0].report.predictionBefore.before,
                            maxBefore: title.windowReports[0].report.predictionBefore.before + title.windowReports[0].report.predictionBefore.positiveError,
                            maxAfter: title.windowReports[0].report.predictionBefore.after + title.windowReports[0].report.predictionBefore.positiveError,
                            minBefore: title.windowReports[0].report.predictionBefore.before + title.windowReports[0].report.predictionBefore.negativeError,
                            minAfter: title.windowReports[0].report.predictionBefore.after + title.windowReports[0].report.predictionBefore.negativeError,
                            maxError: title.windowReports[0].report.predictionBefore.positiveError,
                            minError: title.windowReports[0].report.predictionBefore.negativeError,
                            errors: title.windowReports[0].report.predictionBefore.errorList,
                            changeMaxAndMinBefore: function(percent) {
                                var filtered = this.filterErrors(percent);
                                this.maxBefore = this.before + filtered[0];
                                this.minBefore = this.before + filtered[filtered.length - 1];
                            },
                            changeMaxAndMinAfter: function(percent) {
                                var filtered = this.filterErrors(percent);
                                this.maxAfter = this.after + filtered[0];
                                this.minAfter = this.after + filtered[filtered.length - 1];
                            },
                            filterErrors: function(percent) {
                                percent = percent || 100;
                                var factor = (100 - percent)/100;
                                var cant = this.errors.length*factor;
                                var rest = cant%2;
                                var pos = cant/2 + rest;
                                var neg = cant/2;
                                return neg > 0 ? this.errors.slice(pos, -neg) : this.errors.slice(pos);
                            },
                            changeErrorPercent: function(percent) {
                                var filteredError = this.filterErrors(percent);
                                var min = Math.round(this.errors[this.errors.length-1]*10)/10;
                                var max = Math.round(this.errors[0]*10)/10;
                                var values = [];
                                for (var v = min;v<=max;v+=0.1) {
                                    values.push({c:[{v: v}, {v:0}]});
                                }
                                filteredError.forEach(function(value) {
                                    var cut = Math.round(value*10)/10;
                                    var col = values.filter(function(c) {
                                        var diff = cut - c.c[0].v;
                                        return diff < .05 && diff > -.05;
                                    })[0];
                                    if (col) col.c[1].v++;
                                });
                                values.forEach(function(value) {
                                    value.c[1].v*=100/values.length;
                                });
                                $scope.chartObject.data.rows = values;
                                this.maxError = filteredError[0];
                                this.minError = filteredError[filteredError.length-1];
                            }
                        };
                        return report;
                    });
                    $scope.titles.sort(compareByName);
            },  function(error) {
                    console.log(error);
                }
            );
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
            $scope.selectTitle = function(title) {
                $scope.current = title;
                title.changeErrorPercent($scope.errorPercent);
                if (title.history) {
                    populateWindow(title);
                } else {
                    titlesService.findHistory(title).then(
                        function(history) {
                            console.log(JSON.stringify(history));
                            title.history = history;
                            populateWindow(title);
                        });
                }
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
})();