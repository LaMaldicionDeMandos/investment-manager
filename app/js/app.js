/**
 * Created by marcelo on 02/11/15.
 */
appName = 'Investment Manager';
(function () {
    'use strict';

    var _templateBase = './html';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'googlechart',
        'app.controllers',
        'global.controllers',
        'app.services',
        'global.directives',
        'app.directives'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/predictions.html',
                controller: 'predictionsController'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
        ]);

})();