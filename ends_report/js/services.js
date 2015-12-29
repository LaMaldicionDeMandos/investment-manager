/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    var Title = require('../database').TitleEnds;
    angular.module('app.services', [])
        .factory('titlesService', function ($q) {
            return {
                find : function(name) {
                    var def = $q.defer();
                    Title.findOne({name: name}, function(err, title) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }
                        def.resolve(title);
                    });
                    return def.promise;
                }
            };
        })
    })();