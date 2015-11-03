/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    var Title = require('../database').Title;
    angular.module('app.services', [])
        .factory('titlesService', function ($q) {
            return {
                all: function () {
                    var def = $q.defer();
                    Title.find({}).select('name windowReports').exec(function(err, titles) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }
                        def.resolve(titles);
                    });
                    return def.promise;
                }
            };
        });
    })();