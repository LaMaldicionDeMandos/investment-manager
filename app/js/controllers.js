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
                        return {
                            name: title.name,
                            after: title.windowReports[0].report.predictionBefore.after,
                            before: title.windowReports[0].report.predictionBefore.before,
                            maxBefore: title.windowReports[0].report.predictionBefore.before + title.windowReports[0].report.predictionBefore.positiveError,
                            maxAfter: title.windowReports[0].report.predictionBefore.after + title.windowReports[0].report.predictionBefore.positiveError,
                            minBefore: title.windowReports[0].report.predictionBefore.before - title.windowReports[0].report.predictionBefore.negativeError,
                            minAfter: title.windowReports[0].report.predictionBefore.after - title.windowReports[0].report.predictionBefore.negativeError,
                        }
                    });
                    $scope.titles.sort(compareByName);
            },  function(error) {
                    console.log(error);
                }
            );

            $scope.selectTitle = function(title) {
                $scope.current = title;
            };
        })
})();