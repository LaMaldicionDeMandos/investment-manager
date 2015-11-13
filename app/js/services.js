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
                },
                findHistory: function(title) {
                    var def = $q.defer();
                    Title.findOne({_id: title.id}).select('history').exec(function(err, titleHistory) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }
                        titleHistory.history.forEach(function(item) {
                            item.percentAfterOpen = function() {
                                return 100*(item.closing - item.opening)/item.opening;
                            };
                            item.percentBeforeOpen = function() {
                                return 100*(item.closing - item.opening + item.jump)/(item.opening - item.jump);
                            };
                        });
                        def.resolve(titleHistory.history);
                    });
                    return def.promise;
                }
            };
        });
    })();