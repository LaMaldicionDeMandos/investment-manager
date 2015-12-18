/**
 * Created by marcelo on 17/12/15.
 */
(function () {
    'use strict';
    var Title = require('../database').Title;
    var dailyData = require('../daily-data');
    var path = './titles/runtime';
    angular.module('global.services', [])
        .factory('globalTitlesService', function ($q) {
            return {
                dailyData: function(titleName, n) {
                    return dailyData(titleName, path, n);
                },
                all: function () {
                    var def = $q.defer();
                    Title.find({}).select('name').exec(function(err, titles) {
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
                    Title.findOne({_id: title._id}).select('history').exec(function(err, titleHistory) {
                        if (err) {
                            console.log(err);
                            def.reject(err);
                            return;
                        }
                        titleHistory.history.forEach(function(item) {
                            item.percentAfterOpen = 100*(item.closing - item.opening)/item.opening;
                            item.percentBeforeOpen = 100*(item.closing - item.opening + item.jump)/(item.opening - item.jump);
                            item.percentMin = 100*(item.min - item.opening + item.jump)/(item.opening - item.jump);
                            item.percentMax = 100*(item.max - item.opening + item.jump)/(item.opening - item.jump);
                        });
                        def.resolve(titleHistory.history);
                    });
                    return def.promise;
                }
            };
        });
})();