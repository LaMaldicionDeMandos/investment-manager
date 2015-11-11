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

            $scope.changeAllMaxAndMin = function(percent) {
                $scope.titles.forEach(function(title) {
                    title.changeAllMaxAndMin(percent);
                });
            };
            titlesService.all().then(
                function(titles) {
                    $scope.titles = titles.map(function(title) {
                        var report = {
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
                            changeMaxAndMin: function(percent) {
                                var filtered = this.filterErrors(percent);
                                this.maxAfter = after + filtered[0];
                                this.minAfter = after + filtered[filtered.length - 1];
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

            $scope.selectTitle = function(title) {
                $scope.current = title;
                $scope.current.changeErrorPercent($scope.errorPercent);
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
        })
})();