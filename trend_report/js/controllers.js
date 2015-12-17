/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('mainController', function($scope, globalTitlesService, $mdSidenav) {
            $scope.titles = undefined;
            $scope.open = function() {
                $mdSidenav('report')
                    .toggle()
                    .then(function () {
                        console.log("toggle  is done");
                    });
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