/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('predictionsController', function($scope, $mdSidenav, titlesService) {
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
                            errors: title.windowReports[0].report.predictionBefore.errorList
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
                var min = Math.round(title.errors[title.errors.length-1]*10)/10;
                var max = Math.round(title.errors[0]*10)/10;
                var values = [];
                for (var v = min;v<=max;v+=0.1) {
                    values.push({c:[{v: v}, {v:0}]});
                }
                title.errors.forEach(function(value) {
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
                "rows": [{
                    c: [{
                        v: 2.5
                    }, {
                        v: 19
                    }]
                }, {
                    c: [{
                        v: 3
                    }, {
                        v: 13
                    }]

                }, {
                    c: [{
                        v: 4
                    }, {
                        v: 24
                    }]
                }]
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