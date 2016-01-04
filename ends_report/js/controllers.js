/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('mainController', function($scope, globalTitlesService, titlesService, $mdSidenav) {
            $scope.titles = [];
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
            var compareByPercent = function(a, b) {
                return a.percent < b.percent ? 1 : -1;
            };
            var compareByAverangePercent = function(a, b) {
                return a.averangePercent < b.averangePercent ? 1 : -1;
            };
            $scope.sortByName = function() {
                $scope.sorterBy = 'name';
                $scope.titles.sort(compareByName);
            };
            $scope.sortByPercent = function() {
                $scope.sorterBy = 'percent';
                $scope.titles.sort(compareByPercent);
            };
            $scope.sortByAverangePercent = function() {
                $scope.sorterBy = 'averange';
                $scope.titles.sort(compareByAverangePercent);
            };
            $scope.selectTitle = function(title) {
                $scope.currentTitle = title;
            };
            globalTitlesService.all().then(function(titles) {
                titles.forEach(function(dto) {
                    titlesService.find(dto.id).then(function(title) {
                        console.log(JSON.stringify(title));
                        if (title == null) return;
                        $scope.titles.push(title);
                        title.slow = true;
                        try {
                            var dailySize = globalTitlesService.dailyData(dto.name, 1)[0].length;
                            console.log(dto.name + ' --- size: ' + dailySize);
                            title.slow = dailySize < 20;
                        } catch(e){
                            console.log(dto.name + ' --- Error: ' + e);
                        }
                    });
                });
            });
        });

})();