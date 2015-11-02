/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';

    var _templateBase = './js';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + '/../assets/html/hello.html'
/*                controller: '',
                controllerAs: '_ctrl' */
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
        ]);

})();