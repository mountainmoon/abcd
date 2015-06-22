(function() {
  'use strict';

  angular.module('timer', []);

  angular.module('timer').directive('timer', timer);

  angular.module('timer').directive('circleProgress', circleProgress);

  /**
   * todo: trigger events when the state is changed; add ready state.
   */
  function timer($interval) {
    return {
      restrict: 'E',
      scope: {
        totalTime: '=',
        option: '=',  // see `circleProgress`
        remain: '=',
        id: '@'
      },
      templateUrl: 'ng-timer.html',
      link: function(scope) {
        var obj = {}, promise = obj;

        scope.$watch('totalTime', function(totalTime) {
          totalTime = parseInt(totalTime);
          if (isNaN(totalTime)) return;

          // todo: should unwatch it when it is initialized ?
          scope.remain = totalTime;
          if (promise.then) $interval.cancel(promise);
          run();
        });

        scope.progress = function() {
          return 1 - scope.remain / scope.totalTime;
        };

        function run() {
          promise = $interval(function() {
            if (scope.remain <= 0)
              $interval.cancel(promise);
            else
              scope.remain--;
          }, 1000);
        }


        // control timers through angular events
        scope.$on('timer.run', function(event, id) {
          if (typeof id === 'undefined' || (id && id === scope.id)) {
            if (promise.then) return;
            run();
          }
        });

        scope.$on('timer.pause', function(event, id) {
          if (typeof id === 'undefined' || (id && id === scope.id)) {
            if (promise.then) {
              $interval.cancel(promise);
              promise = obj;
            }
          }
        });

        scope.$on('timer.stop', function(event, id) {
          if (typeof id === 'undefined' || (id && id === scope.id)) {
            scope.remain = scope.totalTime = 0;
            if (promise.then) {
              $interval.cancel(promise);
              promise = obj;
            }
          }
        })

      }
    }
  }

  function circleProgress($compile) {
    // see the factor's detail in http://spencermortensen.com/articles/bezier-circle/
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