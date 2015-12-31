/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    var database = require('../database');
    angular.module('app.services', [])
        .factory('titlesService', function ($q) {
            return {
                find : function(id) {
                    var def = $q.defer();
                    database.TitleTrend.findOne({_id: id}, function(err, title) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }
                        console.log('Found trend ' + title.name);
                        def.resolve(title);
                    });
                    return def.promise;
                }
            };
        })
    })();