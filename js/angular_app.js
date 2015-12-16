/**
 * Created by marcelo on 16/12/15.
 */
var _templateBase = templateBase;
(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'googlechart',
        'app.controllers',
        'global.controllers',
        'app.services',
        'app.directives',
        'global.directives',
    ]).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: _templateBase + '/main.html',
            controller: 'mainController'
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }
    ]);
})();
