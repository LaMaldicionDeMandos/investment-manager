/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
//    var mysql = require('mysql');
    angular.module('app.services', [])
        .factory('titlesService', function () {
            return {
                all: function () {
                    return ['title1', 'title2'];
                }
            };
        });
})();