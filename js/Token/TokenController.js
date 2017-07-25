'use strict';

app.controller('TokenController', ['$scope', 'UserService', 'TokenService', '$q', 'filterFilter', function($scope, UserService, TokenService, $q, filterFilter) {
	$scope.pageClass = 'token';
	$scope.tokens = [];
    $scope.pagination = {
    		order:'fullName',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};
    
    $scope.remove = remove;
    
    function remove(id){
        console.log('id to be deleted', id);
//        if($scope.token.tokId === id) {//clean form if the user to be deleted is shown there.
//            reset();
//        }
//        deleteTeam(id);
    }
	
	var browsers = ["Firefox", 'Chrome', 'Trident']

    $q.all([
        UserService.fetchAllUsers(),
        TokenService.fetchAllTokens()
    ]).then(function (data) {
        var users = data[0];
        var tokens = data[1];

        tokens.forEach(function (token) {
            users.forEach(function (user) {
                if (token.userLogin == user.employeeId) {
                    token.firstName = user.firstName;
                    token.lastName = user.lastName;
                    token.fullName = user.lastName + ", " + user.firstName + " " + user.middleName;
                    browsers.forEach(function (browser) {
                        if (token.userAgent.indexOf(browser) > -1) {
                            token.browser = browser;
                        }
                    });
                }
            });
        });

        $scope.pagination.itemCount=tokens.length;
        $scope.tokens = tokens;
    });
	
    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.tokens, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });
}]);