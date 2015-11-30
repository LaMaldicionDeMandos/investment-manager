/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    var Title = require('../database').Title;
    var TitleExtreme = require('../database').TitleExtreme;
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
                            item.percentMin = function() {
                                return 100*(item.min - item.opening + item.jump)/(item.opening - item.jump);
                            };
                            item.percentMax = function() {
                                return 100*(item.max - item.opening + item.jump)/(item.opening - item.jump);
                            };
                        });
                        def.resolve(titleHistory.history);
                    });
                    return def.promise;
                },
                findExtremes: function(title) {
                    var def = $q.defer();
                    TitleExtreme.findOne({code: title.name}, function(err, extreme) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }

                        def.resolve(extreme.extremes);
                    });
                    return def.promise;
                }
            };
        });
    })();