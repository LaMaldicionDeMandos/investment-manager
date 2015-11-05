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
                return a.windowReports[0].report.predictionBefore.before < b.windowReports[0].report.predictionBefore.before
                    ? 1 : -1;
                };
            var compareByAfter = function(a, b) {
                return a.windowReports[0].report.predictionBefore.after < b.windowReports[0].report.predictionBefore.after
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
                    $scope.titles = titles;
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