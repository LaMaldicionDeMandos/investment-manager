/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('predictionsController', function($scope, titlesService) {
            $scope.titles = titlesService.all();
        })
})();