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

.directive('collapsible', ['$timeout', 'styleSheetFactory', function($timeout, styleSheetFactory) {
    return {
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
                styleSheetFactory.addCSSRule(styleSheet, 'collapsible',
                    'display: block;' +
                    'overflow: hidden;' +
                    '-'+prefix+'-transition: max-height ease '+animationLength+'ms;' +
                    'transition: max-height ease '+animationLength+'ms;'
                , 1);

                // Set the initial max height for the element.
                setMaxHeight();

                // Set the initial state for the element.
                if($attrs.collapse == 'true') {
                    $element[0].setAttribute('style',
                        'max-height: 0px;'
                    );
                } else {
                    $element[0].setAttribute('style',
                        'max-height: '+$element[0].getAttribute('maxheight')+';'
                    );
                }

                $element.addClass('collapsible');
            }

            // Finds the maximum height of the collapsible element, and stores the value
            // as an attribute on the element.
            var setMaxHeight = function(){
                var element = $element[0];

                // Remove the current style.
                element.setAttribute('style', '');

                // Get the height of the element.
                var height = window.getComputedStyle(element, null).getPropertyValue('height');
                
                // Set the attribute with the new computed height.
                element.setAttribute('maxheight', height);

                // If the element was collapsed, hide it again. Otherwise, give it the new height.
                if(element.getAttribute('collapse') == 'true') {
                    element.setAttribute('style', 'max-height: 0px;');
                } else {
                    element.setAttribute('style', 'max-height: '+height+';');
                }
            }

            // Catch any broadcast to resize a collapsible, and perform it if it's the target.
            $scope.$on('resizeCollapsible', function($event, $args) {
                if($element[0].id == $args.id) {
                    setMaxHeight();
                }
            });

            $scope.toggleCollapsible = function(id) {
                var element = document.querySelector('#'+id);

                var curHeight = window.getComputedStyle(element, null).getPropertyValue('height');

                if(element.getAttribute('collapse') == 'true') {
                    element.setAttribute('style',
                        'max-height: '+element.getAttribute('maxheight')+';'
                    );
                    element.setAttribute('collapse', 'false');
                } else {
                    element.setAttribute('style',
                        'max-height: 0px;'
                    );
                    element.setAttribute('collapse', 'true');
                }
            }

            // Initialize the directive
            init();
        }
    }
}]);
