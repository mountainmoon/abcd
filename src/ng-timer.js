(function() {
  'use strict';

  angular.module('abcd', []);

  angular.module('abcd').directive('timer', timer);

  angular.module('abcd').directive('circleProgress', circleProgress);

  function timer($interval) {
    return {
      restrict: 'E',
      scope: {
        totalTime: '@'
      },
      templateUrl: 'ng-timer.html',
      link: function(scope) {
        scope.remain = scope.totalTime = +scope.totalTime;
        scope.r = 95;
        scope.w = 10;
        scope.progress = function() {
          return 1 - scope.remain / scope.totalTime;
        };

        var p = $interval(function() {
          if (scope.remain <= 0)
            $interval.cancel(p);
          else
            scope.remain--;
        }, 1000)
      }
    }
  }

  function circleProgress($compile) {
    // http://spencermortensen.com/articles/bezier-circle/
    var factor = 0.5519;

    var xmlns = 'http://www.w3.org/2000/svg';

    /**
     *  Get a circle following the constraint: L = 2r + s.
     *  Ex.: Given 200 * 200 svg, stroke width is 10, then r(radius) = (L - s)/2 = 95, and cx(cy) = 100,
     *  so call getCirclePath(100, 100, 95)
     */
    function getCirclePath(cx, cy, r) {
      var d = factor * r;
      return  'M' + p(cx, cy - r) +
        ' c' + [p(d, 0), p(r, r - d), p(r, r)].join(', ') +
        ' c' + [p(0, d), p(d - r, r), p(-r, r)].join(', ') +
        ' c' + [p(-d, 0), p(-r, d - r), p(-r, -r)].join(', ') +
        ' c' + [p(0, -d), p(r - d, -r), p(r, -r)].join(', ') + 'Z';
    }

    function p(x, y) {
      return x + ' ' + y;
    }

    return {
      scope: {
        progress: '=',  // range in [0,1]
        r: '@',         // the radius of the circle
        w: '@'          // the width of the stroke
      },
      restrict: 'E',
      link: function(scope, elem) {
        scope.$watchGroup(['r', 'w'], function(rw) {
          var r = parseInt(rw[0]);
          var w = parseInt(rw[1]);
          if (isNaN(r + w)) return;

          var  c, svg, path, perimeter, d, width;
          svg = document.createElementNS(xmlns, 'svg');
          path = document.createElementNS(xmlns, 'path');
          c = (2 * r + w) / 2;
          width = 2 * r + w;
          d = getCirclePath(c, c, r);

          svg.setAttribute('width', width);
          svg.setAttribute('height', width);

          path.setAttribute('d', d);
          perimeter = path.getTotalLength();
          path.setAttribute('stroke-width', w);
          path.setAttribute('stroke-dasharray', perimeter);
          path.setAttribute('stroke-dashoffset', '{{(1 - progress) * ' + perimeter + '}}');
          path.setAttribute('fill', 'transparent');

          svg.appendChild(path);
          elem.append(svg);

          $compile(svg)(scope);
        });
      }
    };
  }
})();