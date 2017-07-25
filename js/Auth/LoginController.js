'use strict';

app.controller('LoginController', ['$rootScope', '$scope', 'AuthSharedService', function($rootScope, $scope, AuthSharedService) {
	$scope.pageClass = 'loginBox';
    $scope.rememberMe = true;
    $scope.login = function () {
        $rootScope.authenticationError = false;
        AuthSharedService.login(
            $scope.username,
            $scope.password,
            $scope.rememberMe
        );
    }
}]);