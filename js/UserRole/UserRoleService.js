'use strict';

app.factory('UserRoleService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_USERROLES = 'http://localhost:8080/tms_api/UserRole/';

    var factory = {
        fetchAllUserRoles:fetchAllUserRoles,
        createUserRole:createUserRole,
        updateUserRole:updateUserRole,
        deleteUserRole:deleteUserRole
    };

    return factory;
    
    function fetchAllUserRoles() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_USERROLES)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching User Roles');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function createUserRole(user) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_USERROLES, user)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating User Roles');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateUserRole(user, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_USERROLES+id, user)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating User Roles');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteUserRole(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_USERROLES+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting User Roles');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);