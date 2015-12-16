/**
 * Created by marcelo on 02/11/15.
 */
appName = 'Investment Manager - Window Report';
(function () {
    'use strict';

    var _templateBase = '../window_report/html';

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
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }
    ]);
})();