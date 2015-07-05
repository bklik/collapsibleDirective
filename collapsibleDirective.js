/***********************************************************************
 * Collapsible Directive
 * Author: Brenton Klik
 * 
 * Prerequisites:
 *  - AngularJS
 *  - styleSheetFactory (https://github.com/bklik/styleSheetFactory)
 * 
 * Description:
 * Creates a block element that can collapse and expand itself.
/**********************************************************************/
angular.module('collapsibleDirective', ['styleSheetFactory'])

.directive('collapsibleDirective', ['$timeout', 'styleSheetFactory', function($timeout, styleSheetFactory) {
    return {
        scope: {
            api: '='
        },
        restrict: 'E',
        link: function($scope, $element, $attrs) {
            // Tracks when a touch event fires before a mouse event.
            var isTouch = false;

            // The amount of time (in miliseconds) you want the animation to last.
            var animationLength = 250;

            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Initialize function for the directive that gets called at the end.
            var init = function() {
                // Add this directive's styles to the document's stylesheet.
                var cssAdded = styleSheetFactory.addCSSRule(styleSheet, 'collapsible-directive',
                    'display: block;' +
                    'overflow: hidden;' +
                    '-'+prefix+'-transition: max-height ease '+animationLength+'ms;' +
                    'transition: max-height ease '+animationLength+'ms;'
                , 1);

                var cssAdded = styleSheetFactory.addCSSRule(styleSheet, 'collapsible-directive.collapse',
                    'max-height: 0 !important;'
                , 1);

                // Collapse if 'collapse' attribute set to true.
                $scope.collapse = ($attrs.collapse == 'true') ? true : false;
                if($scope.collapse) {
                    $element.addClass('collapse');
                }

                // Look for changes in the collapse attribute
                $attrs.$observe('collapse', function(newValue) {
                    newValue = (newValue == 'true') ? true : false;
                    if(newValue != $scope.collapse) {
                        $scope.api.toggle();
                    }
                });
            }

            $scope.api = {
                // Finds the maximum height of the collapsible element, and stores the value
                // as an attribute on the element.
                setMaxHeight: function(offset){
                    offset = parseInt(offset);
                    offset = (offset + '' == 'NaN') ? 0 : offset;

                    // Remove the current style.
                    $element.removeClass('collapse');
                    $element[0].setAttribute('style', '');

                    // Get the height of the element.
                    var height = window.getComputedStyle($element[0], null).getPropertyValue('height');
                        height = (offset + parseFloat(height)) + 'px';

                    $element[0].setAttribute('style', 'max-height: ' + height + ';');

                    // If the element was collapsed, hide it again. Otherwise, give it the new height.
                    if($scope.collapse) {
                        $element.addClass('collapse');
                    }

                    return parseInt(height);
                },

                toggle: function() {
                    var height = $scope.api.setMaxHeight();

                    $timeout(function() {
                        if($scope.collapse) {
                            $element.removeClass('collapse');
                            $scope.collapse = false;

                            // Call parent collapsible's setMaxHeight with this collapsible's offset.
                            var parent = $element.parent();
                            while(parent.prop('tagName')) {
                                if(parent.prop('tagName') == 'COLLAPSIBLE-DIRECTIVE') {
                                    var api = parent.attr('api');
                                    parent.scope()[api].setMaxHeight(height);
                                }
                                parent = parent.parent();
                            }
                        } else {
                            $element.addClass('collapse');
                            $scope.collapse = true;
                        }
                    }, 50);
                },

                test: function(h) {
                    console.log('worked: ' + h);
                }
            }

            window.addEventListener('resize', $scope.api.setMaxHeight);

            $scope.$on('destroy', function() {
                window.removeEventListener($scope.api.setMaxHeight);
            });

            // Initialize the directive
            init();
        }
    }
}]);
