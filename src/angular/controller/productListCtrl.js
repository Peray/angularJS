angular.module('sportsStore')
	.constant('productListActiveClass', 'btn-primary')
	.constant('productListPageCount', 5)
	.controller('productListCtrl', ['$scope', '$filter', 'productListActiveClass', 'productListPageCount',　'cart', function($scope, $filter, productListActiveClass, productListPageCount, cart){
		var selectedCategory = null;

		$scope.selectedPage = 1;
		$scope.pageSize = productListPageCount;

		$scope.selectedCategory = function (newCategory) {
			selectedCategory = newCategory;
			$scope.selectedPage = 1;
		};

		$scope.selectPage = function (newPage) {
			$scope.selectedPage = newPage;
		};

		$scope.categoryFilterFn = function (product) {
			return selectedCategory == null || product.category == selectedCategory;
		};

		$scope.getCategoryClass = function (category) {
			return selectedCategory == category ? productListActiveClass : "";
		};

		$scope.getPageClass = function (page) {
			return $scope.selectedPage == page ? productListActiveClass : "";
		};

		$scope.addProductToCart = function (product) {
			cart.addProduct(product.id, product.name, product.price);
		};

		// var object1 = {
		// 	"Toney" : {
		// 		"Math" : 95,
		// 		"English" : 79,
		// 		"Music" : 68
		// 	},
		// 	"Simon" : {
		// 		"Math" : 95,
		// 		"English" : 79,
		// 		"Music" : 68
		// 	},
		// 	"Annie" : {
		// 		"Math" : 95,
		// 		"English" : 79,
		// 		"Music" : 68
		// 	}
		// }


		// Object.prototype.oToA = function () {
		// 	let arr = [],
		// 		arr2 = [],
		// 		arr3 = [];
		// 	var that = this;
		// 	if (typeof that == 'object') {
		// 		arr2 = Object.values(that);
		// 		arr3 = Object.keys(that);
		// 		console.log(arr2);
		// 		console.log(arr3);
		// 		arr4 = Object.assign(arr2,arr3);
		// 		console.log(arr4)
		// 	}
		// 	return arr;
		// }
		// object1.oToA()
	}])