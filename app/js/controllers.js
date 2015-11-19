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
        .controller('predictionsController', function($scope, $mdSidenav) {
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
                $scope.$broadcast('currentTitleEvent', title);
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

            $scope.$on('currentTitleEvent', function( event, title) {
                $scope.current = title;
                var values = title.changeErrorPercent($scope.errorPercent);
                $scope.chartObject.data.rows = values;
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
})();