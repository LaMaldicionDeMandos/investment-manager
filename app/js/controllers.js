/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('predictionsController', function($scope, titlesService) {
            titlesService.all().then(
                function(titles) {
                    $scope.titles = titles;
            },  function(error) {
                    console.log(error);
                }
            );
        })
})();