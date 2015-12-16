/**
 * Created by marcelo on 16/12/15.
 */
(function () {
    'use strict';
    angular.module('global.controllers', [])
        .controller('globalMainController', function($scope) {
            $scope.appName = appName;
        })
})();