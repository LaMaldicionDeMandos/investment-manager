/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    var Title = require('../database').TitleTrend;
    angular.module('app.services', [])
        .factory('titlesService', function ($q) {
            return {
                find : function(id) {
                    var def = $q.defer();
                    Title.findOne({_id: id}, function(err, title) {
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