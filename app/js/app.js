/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';

    var _templateBase = './assets/html';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'googlechart',
        'app.controllers',
        'app.services',
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