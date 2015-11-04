/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('predictionsController', function($scope, titlesService) {
            var sortByName = function(a, b) {
                return a.name > b.name ? 1 : -1;
                };
            titlesService.all().then(
                function(titles) {
                    $scope.titles = titles;
                    $scope.titles.sort(sortByName);
            },  function(error) {
                    console.log(error);
                }
            );
        })
})();