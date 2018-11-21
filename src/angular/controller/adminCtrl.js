angular.module('sportsStoreAdmin')
	.constant('authUrl', 'http://localhost:5500/users/login')
	.constant('ordersUrl', 'http://localhost:5500/orders')
	.controller('authCtrl', ['$scope', '$http', '$location', 'authUrl', function($scope, $http, $location, authUrl){

		$scope.authenticate = function (user, pass) {
			$http.post(authUrl, {
				username: user,
				password: pass
			}, {
				withCredentials: true
			}).then(function (data) {
				$location.path('/main');
			}, function (error) {
				$scope.authenticationError = error;
			})
		}
	}])
	.controller('mainCtrl', ['$scope', function ($scope) {

		$scope.screens = ['Products', 'Orders'];
		$scope.current = $scope.screens[0];

		$scope.setScreen = function (index) {
			$scope.current = $scope.screens[index];
		};

		$scope.getScreen = function () {
			return $scope.current == 'Products' ? 'src/angular/views/admin/adminProducts.html' : 'src/angular/views/admin/adminOrders.html';
		};
	}])
	.controller('ordersCtrl', ['$scope', '$http', 'ordersUrl', function($scope, $http, ordersUrl){
		
		$http.get(ordersUrl, {withCredentials : true})
			.then(function (data) {
				$scope.orders = data.data;
			}, function (error) {
				$scope.error = error;
			});

		$scope.selectedOrder;

		$scope.selectOrder = function (order) {
			$scope.selectedOrder = order;
		};

		$scope.calcTotal = function (order) {
			var total = 0;
			for(var i = 0; i < order.products.length; i++) {
				total += order.products[i].count * order.products[i].price
			};
			return total;
		};

	}])