app.service('AuthSharedService', function ($rootScope, $http, $resource, authService, Session) {
    return {
        login: function (userName, password, rememberMe) {
            var config = {
                ignoreAuthModule: 'ignoreAuthModule',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http.post('http://localhost:8080/tms_api/authenticate', $.param({
                username: userName,
                password: password,
                rememberme: rememberMe
            }), config)
                .success(function (data, status, headers, config) {
                	data.login = true;
                	authService.loginConfirmed(data);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.authenticationError = true;
                    Session.invalidate();
                });
        },
        getAccount: function () {
            $rootScope.loadingAccount = true;
            $http.get('http://localhost:8080/tms_api/Security/Account')
                .then(function (response) {
                    authService.loginConfirmed(response.data);
                });
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles == '*') {
                    return true;
                }
                authorizedRoles = [authorizedRoles];
            }
            var isAuthorized = false;
            angular.forEach(authorizedRoles, function (authorizedRole) {
                var authorized = (!!Session.id &&
                Session.userRoles.indexOf(authorizedRole) !== -1);
                if (authorized || authorizedRole == '*') {
                    isAuthorized = true;
                }
            });
            
            return isAuthorized;
        },
        logout: function () {
            $rootScope.authenticationError = false;
            $rootScope.authenticated = false;
            $rootScope.account = null;
            $http.get('http://localhost:8080/tms_api/logout');
            Session.invalidate();
            authService.loginCancelled();
        }
    };
});