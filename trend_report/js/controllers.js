/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('mainController', function($scope, globalTitlesService, $mdSidenav) {
            $scope.titles = undefined;
            $scope.sorterBy;
            $scope.open = function() {
                $mdSidenav('report')
                    .toggle()
                    .then(function () {
                        console.log("toggle  is done");
                    });
            };
            var compareByName = function(a, b) {
                return a.name > b.name ? 1 : -1;
            };
            var compareByUp = function(a, b) {
                return a.upPercent < b.upPercent ? 1 : -1;
            };
            $scope.sortByName = function() {
                $scope.sorterBy = 'name';
                $scope.titles.sort(compareByName);
            };
            $scope.sortByUp = function() {
                $scope.sorterBy = 'up';
                $scope.titles.sort(compareByUp);
            };
            $scope.selectTitle = function(title) {
                $scope.currentTitle = title;
            };
            globalTitlesService.all().then(function(titles) {
                $scope.titles = titles.map(function(dto) {
                    var title = new Title(dto);
                    globalTitlesService.findHistory(dto).then(function(history) {
                        title.setHistory(history);
                    });
                    return title;
                });
            });
        });

})();