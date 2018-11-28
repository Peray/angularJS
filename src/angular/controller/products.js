angular.module('exampleApp', ['increment', 'ngResource', 'ngRoute', 'ngAnimate'])
.constant('baseUrl', 'http://localhost:5600/products/')
.factory('productsResource', ['$resource', 'baseUrl', function($resource, baseUrl){
	return $resource(baseUrl + ":id", {id: "@id"}, 
		{create: {method: "POST"}, save: {method: "PUT"}});
}])
.config(function($routeProvider, $locationProvider){

	$locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix(''); // 1.6.x版本使用路由功能需加上这句 

	$routeProvider.when("/list", {
		templateUrl: 'src/html/restful/tableView.html',
		controller: 'tableCtrl'
	}).when("/edit/:id", {
		templateUrl: 'src/html/restful/editorView.html',
		controller: 'editCtrl'
	}).when("/create", {
		templateUrl: 'src/html/restful/editorView.html',
		controller: 'editCtrl'
	}).otherwise({
		templateUrl: 'src/html/restful/tableView.html',
		controller: 'tableCtrl',
		resolve: {
			data: function(productsResource) {
				return productsResource.query();
			}
		}
	});
})
.controller("defaultCtrl", ['$scope', '$location', 'productsResource', function($scope, $location, productsResource) {

	$scope.data = {};

	$scope.createProduct = function (product) {
		new productsResource(product).$create().then(function(newProduct){
			$scope.data.products.push(newProduct);
			$location.path('/list');
		});
	};

	$scope.deleteProduct = function (product) {
		product.$delete().then(function() {
			$scope.data.products.splice($scope.data.products.indexOf(product), 1);
		});
		$location.path('/list');
	};

}])
.controller("tableCtrl", function($scope, $location, $route, data) {

	$scope.data.products = data;

	$scope.refreshProducts = function () {
		$route.reload();
	};

})
.controller("editCtrl", function($scope, $location, $routeParams) {

	$scope.currentProduct = null;

	if($location.path().indexOf("/edit/") == 0) {
		var id = $routeParams["id"];
		for(var i = 0; i < $scope.data.products.length; i++) {
			if($scope.data.products[i].id == id) {
				$scope.currentProduct = $scope.data.products[i];
				break;
			}
		}
	}

	$scope.cancleEdit = function () {
		$location.path('/list');
	};

	$scope.updateProduct = function (product) {
		product.$save();
		$location.path('/list');
	};

	$scope.saveEdit = function(product) {
		if(angular.isDefined(product.id)) {
			$scope.updateProduct(product);
		} else {
			$scope.createProduct(product);
		}
		$scope.currentProduct = {};
	};
});