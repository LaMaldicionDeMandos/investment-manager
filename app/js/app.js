/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';

    var _templateBase = './js';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'app.controllers',
        'app.services'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/../assets/html/predictions.html',
                controller: 'predictionsController'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
        ]);

})();