/**
 * Created by marcelo on 04/11/15.
 */
(function () {
    'use strict';
    angular.module('app.directives', [])
        .directive('inColor', function() {
            return {
              restrict: 'A',
              scope: {
                  options: '=',
                  model: '=ngModel'
              },
              link: function(scope, element, attrs, coontroller) {
                  scope.$watch('model', function(value) {
                      if (value > 0) {
                          element.css('color', 'green');
                      } else if (value < 0) {
                          element.css('color', 'red');
                      } else {
                          element.css('color', 'black');
                      }
                  })
              }
            };
        })
})();