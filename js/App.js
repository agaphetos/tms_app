'use strict';

var app = angular
    .module('tmsApp', ['ngResource', 'ngRoute', 'http-auth-interceptor', 'ngAnimate', 'ngMaterial', 'md.data.table', 'angular-spinkit']);


app.constant('USER_ROLES', {
    all: '*',
    admin: 'Administrator',
    supervisor: 'Supervisor',
    manager: 'Manager',
    staff: 'Staff'
});


app.config(function ($routeProvider, USER_ROLES) {
//	$locationProvider, 
    $routeProvider.when("/Home", {
        templateUrl: "views/Home.html",
        controller: 'HomeController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/', {
        redirectTo: '/Home'
    }).when('/ForgotPassword', {
        templateUrl: 'views/ForgotPassword.html',
        controller: 'ForgotPasswordController',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/FirstLogin', {
        templateUrl: 'views/Security/FirstLogin.html',
        controller: 'SecurityController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/ChangePassword', {
        templateUrl: 'views/Security/ChangePassword.html',
        controller: 'SecurityController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/UserManagement', {
        templateUrl: 'views/UserManagement/Menu.html',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/UserManagement/Users', {
        templateUrl: 'views/UserManagement/User/Show.html',
        controller: 'UserController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/UserManagement/UserRoles', {
        templateUrl: 'views/UserManagement/UserRole/Show.html',
        controller: 'UserRoleController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/UserManagement/Teams', {
        templateUrl: 'views/UserManagement/Team/Show.html',
        controller: 'TeamController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/TaskMaintenance', {
        templateUrl: 'views/TaskMaintenance/Menu.html',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/TaskMaintenance/ApplicationTypes', {
        templateUrl: 'views/TaskMaintenance/ApplicationType/Show.html',
        controller: 'ApplicationTypeController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/TaskMaintenance/TaskStatus', {
        templateUrl: 'views/TaskMaintenance/TaskStatus/Show.html',
        controller: 'TaskStatusController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/TaskMaintenance/TaskTypes', {
        templateUrl: 'views/TaskMaintenance/TaskType/Show.html',
        controller: 'TaskTypeController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.supervisor, USER_ROLES.manager]
        }
    }).when('/TaskManagement', {
        templateUrl: 'views/TaskManagement/Show.html',
        controller: 'TaskController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/Tokens', {
        templateUrl: 'views/Tokens/Show.html',
        controller: 'TokenController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/Login', {
        templateUrl: 'views/Login.html',
        controller: 'LoginController',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when('/Loading', {
        templateUrl: 'views/Components/Loading.html',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when("/Logout", {
        template: " ",
        controller: "LogoutController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    }).when("/Error/:code", {
        templateUrl: "views/Error.html",
        controller: "ErrorController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    }).otherwise({
        redirectTo: '/Error/404',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    });

//    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, $q, $timeout) {

    $rootScope.$on('$routeChangeStart', function (event, next) {

        if(next.originalPath === "/Login" && $rootScope.authenticated) {
            event.preventDefault();
        } else if (next.access && next.access.loginRequired && !$rootScope.authenticated) {
            event.preventDefault();
            $rootScope.$broadcast("event:auth-loginRequired", {});
        } else if (next.access && !AuthSharedService.isAuthorized(next.access.authorizedRoles)) {
            event.preventDefault();
            $rootScope.$broadcast("event:auth-forbidden", {});
        }
    });

    // Call when the the client is confirmed
    $rootScope.$on('event:auth-loginConfirmed', function (event, data) {
        console.log('login confirmed start ' + data);
        $rootScope.loadingAccount = false;
        var nextLocation = ($rootScope.requestedUrl ? $rootScope.requestedUrl : "/home");
        var delay = ($location.path() === "/Loading" ? 1500 : 0);

        $timeout(function () {
            Session.create(data);
            $rootScope.account = Session;
            $rootScope.authenticated = true;
            if (Session.firstLog == 1) {
            	nextLocation = "/FirstLogin";
            }
            $location.path(nextLocation).replace();
        }, delay);

    });

    // Call when the 401 response is returned by the server
    $rootScope.$on('event:auth-loginRequired', function (event, data) {
        if ($rootScope.loadingAccount && data.status !== 401) {
            $rootScope.requestedUrl = $location.path()
            $location.path('/Loading');
        } else {
            Session.invalidate();
            $rootScope.authenticated = false;
            $rootScope.loadingAccount = false;
            $location.path('/Login');
        }
    });

    // Call when the 403 response is returned by the server
    $rootScope.$on('event:auth-forbidden', function (rejection) {
        $rootScope.$evalAsync(function () {
            $location.path('/Error/403').replace();
        });
    });

    // Call when the user logs out
    $rootScope.$on('event:auth-loginCancelled', function () {
        $location.path('/Login').replace();
    });

    // Get already authenticated user account
    AuthSharedService.getAccount();
});





