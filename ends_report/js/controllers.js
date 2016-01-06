/**
 * Created by marcelo on 02/11/15.
 */
(function () {
    'use strict';
    angular.module('app.controllers', [])
        .controller('mainController', function($scope, globalTitlesService, titlesService, $mdSidenav) {
            $scope.titles = [];
            $scope.sorterBy;
            $scope.open = function() {
                $mdSidenav('report')
                    .toggle()
                    .then(function () {
                        console.log("toggle  is done");
                    });
            };
            var compareByName = function(a, b) {
                return a.name > b.name ? 1 : -1;
            };
            var compareByPercent = function(a, b) {
                return a.percent < b.percent ? 1 : -1;
            };
            var compareByAverangePercent = function(a, b) {
                return a.averangePercent < b.averangePercent ? 1 : -1;
            };
            $scope.sortByName = function() {
                $scope.sorterBy = 'name';
                $scope.titles.sort(compareByName);
            };
            $scope.sortByPercent = function() {
                $scope.sorterBy = 'percent';
                $scope.titles.sort(compareByPercent);
            };
            $scope.sortByAverangePercent = function() {
                $scope.sorterBy = 'averange';
                $scope.titles.sort(compareByAverangePercent);
            };
            $scope.selectTitle = function(title) {
                $scope.currentTitle = title;
                populate();
            };

            var calculateEnd = function(ends) {
                var sumBuy = 0;
                var sumSale = 0;
                ends.forEach(function(item) {
                    if (item.buyAmount != null) { sumBuy+= item.buyAmount;}
                    if (item.saleAmount != null) { sumSale+= item.saleAmount;}
                });
                var sum = Math.min(sumBuy, sumSale);
                sumBuy = 0;
                sumSale = 0;
                var buy;
                var sale;
                for (var i = ends.length-1; sum > sumBuy;i--) {
                    sumBuy+= ends[i].buyAmount;
                    if (sumBuy >= sum) {
                        buy = ends[i].buyPrice;
                    }
                }
                for (var j = ends.length-1; sum > sumSale ;j--) {
                    try {
                        sumSale+= ends[j].saleAmount;
                    }catch(e) {
                        throw e;
                    }
                    if (sumSale >= sum) {
                        sale = ends[j].salePrice;
                    }
                }
                return (buy + sale)/2;
            };

            var populateDailyEnds = function(cols, values, index) {
                cols.push({id: 'end', label: 'Puntas',type: 'number'});
                var day = $scope.currentTitle.dailyEnds;
                day.forEach(function(movement) {
                    var date = new Date(movement.time);
                    var hour = date.getHours() > 20 ? 8 : date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    if (!values[hour]) values[hour] = {};
                    if (!values[hour][minute]) values[hour][minute] = {};
                    if (!values[hour][minute][second]) {
                        values[hour][minute][second] = [];
                    }

                    values[hour][minute][second][index] = calculateEnd(movement.ends);
                });
            };

            var populateDailyData = function(cols, values, index) {
                cols.push({id: 'day', label: 'Day',type: 'number'});
                var day = $scope.currentTitle.dailyList;
                day.forEach(function(movement) {
                    var date = new Date(movement.dateTime);
                    var hour = date.getHours() > 20 ? 8 : date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    if (!values[hour]) values[hour] = {};
                    if (!values[hour][minute]) values[hour][minute] = {};
                    if (!values[hour][minute][second]) {
                        values[hour][minute][second] = [];
                    }

                    values[hour][minute][second][index] = movement.value;
                });
            };

            var populate = function() {
                $scope.chartDaily = new Chart(Chart.Type.LINE, undefined, ['blue', 'green']);
                var cols = [{
                    id: "hour",
                    label: "Hora",
                    type: "timeofday"
                }];
                var values = {};
                populateDailyData(cols, values, 0);
                populateDailyEnds(cols, values, 1);
                $scope.chartDaily.data.cols = cols;
                var rows = [];
                for (var hour in values) {
                    for (var minute in values[hour]) {
                        for (var second in values[hour][minute]) {
                            values[hour][minute][second].unshift([parseInt(hour), parseInt(minute), parseInt(second)]);
                            rows.push(Chart.createRow(values[hour][minute][second]));
                        }
                    }
                }
                var latest = [$scope.currentTitle.dailyList.pop().value,
                    calculateEnd($scope.currentTitle.dailyEnds.pop().ends)];
                latest.unshift([14,4,59]);
                rows.push(Chart.createRow(latest));
                $scope.chartDaily.data.rows = rows;
                $scope.chartDaily.options.vAxis.title = 'Diario';
                $scope.chartDaily.options.interpolateNulls = true;
                var colsToShow = [0, 1, 2];
                $scope.chartDaily.view = {columns: colsToShow};

            };
            globalTitlesService.all().then(function(titles) {
                titles.forEach(function(dto) {
                    titlesService.find(dto.id).then(function(title) {
                        console.log(JSON.stringify(title));
                        if (title == null) return;
                        $scope.titles.push(title);
                        title.slow = true;
                        try {
                            var dailyList = globalTitlesService.dailyData(dto.name, 1);
                            title.dailyEnds = globalTitlesService.latestEnds(dto.name);
                            var dailySize = dailyList[0].length;
                            console.log(dto.name + ' --- size: ' + dailySize);
                            title.dailyList = dailyList[0];
                            title.dailyEnds = [{time:1452008047949,ends:[
                                {buyAmount:1200,buyPrice:36.35,salePrice:36.4, saleAmount:9873},
                                {buyAmount:1175,buyPrice:36.3,salePrice:36.5,saleAmount:3617},
                                {buyAmount:15500,buyPrice:36.25,salePrice:36.55,saleAmount:5000},
                                {buyAmount:26100,buyPrice:36.2,salePrice:36.6,saleAmount:5464},
                                {buyAmount:21,buyPrice:36.15,salePrice:36.75,saleAmount:138}]},
                                {time:1452010107949,ends:[
                                    {buyAmount:1000,buyPrice:36.3,salePrice:36.4, saleAmount:9673},
                                    {buyAmount:1175,buyPrice:36.2,salePrice:36.5,saleAmount:3617},
                                    {buyAmount:15500,buyPrice:36.15,salePrice:36.55,saleAmount:5000},
                                    {buyAmount:26100,buyPrice:36.1,salePrice:36.6,saleAmount:5464},
                                    {buyAmount:21,buyPrice:36,salePrice:36.75,saleAmount:138}]}
                            ];
                            title.slow = dailySize < 20;
                        } catch(e){
                            console.log(dto.name + ' --- Error: ' + e);
                        }
                    });
                });
            });
        });

})();