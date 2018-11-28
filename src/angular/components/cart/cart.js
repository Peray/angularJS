angular.module('cart', [])
	.factory('cart', function () {

		var cartData = [];

		return {
			addProduct: function (id, name, price) {
				var addedToExistingItem = false;
				for(var i = 0; i < cartData.length; i++) {
					if(cartData[i].id == id) {
						cartData[i].count++;
						addedToExistingItem = true;
						break;
					}
				};
				if(!addedToExistingItem) {
					cartData.push({
						count: 1, id: id, price: price, name: name
					});
				}
			},

			removeProduct: function (id) {
				for(var i = 0; i < cartData.length; i++) {
					if(cartData[i].id == id) {
						cartData.splice(i,1);
						break;
					}
				};
			},

			getProducts: function () {
				return cartData;
			}
		};
	})
	.directive('cartSummary', ['cart', function (cart){

		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: '/src/angular/components/cart/cartSummary.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {

				var cartData = cart.getProducts();

				$scope.total = function () {
					var total = 0;
					for(var i = 0; i < cartData.length; i++) {
						total += (cartData[i].price * cartData[i].count);
					};
					return total;
				};

				$scope.itemCount = function () {
					var total = 0;
					for(var i = 0; i < cartData.length; i++) {
						total += cartData[i].count;
					};
					return total;
				};

			}
		};
	}]);