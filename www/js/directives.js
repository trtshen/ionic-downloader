(function() {
  'use strict';

  angular.module('downloader.directives', [])
  .directive('progressBar', function() {
      return {
        restrict: 'A',
        scope: {
          photoLength: '=',
          photoTotal: '=',
          dayLeft: '=',
          dayTotal: '=?'
        },
        link: function(scope, element, attrs) {
          scope.$watch('photoLength', function() {
            scope.photoLength = scope.photoLength || 0;
            scope.photoProgress = parseFloat((scope.photoLength / scope.photoTotal) * 100).toFixed(0);
          });

          scope.dayLeft = scope.dayLeft || 0;
          scope.dayTotal = scope.dayTotal || 30;

          if (scope.dayLeft > scope.dayTotal) {
            $scope.dayLeft = scope.dayTotal;
          } else if (scope.dayLeft < 0) {
            $scope.dayLeft = 0;
          }

          var daysPassed = scope.dayTotal - scope.dayLeft;
          scope.dayProgress = parseFloat((daysPassed / scope.dayTotal) * 100).toFixed(0);
          scope.show = false;
        },
        template:
          [
            '<div class="photo-progress">',
              '<div ng-class="show ? \'full\' : \'shrink\'" style="width: {{ photoProgress }}%;">',
                '<span>{{photoLength}} / {{ photoTotal }}</span>',
                '<p style="text-align:center;" ng-if="photoProgress > 0">{{photoProgress}}%</p>',
              '</div>' ,
            '</div>'
          ].join(' ')

      };
    });

}());
