'use strict';

app.factory('UserService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_USERS = 'http://localhost:8080/tms_api/User/';

    var factory = {
        fetchAllUsers: fetchAllUsers,
        fetchSupervisors: fetchSupervisors,
        fetchNotInList: fetchNotInList, 
        fetchEmployeeById:fetchEmployeeById,
        createUser: createUser,
        updateUser:updateUser,
        deleteUser:deleteUser
    };

    return factory;
    
    function fetchAllUsers() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_USERS)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Users');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function createUser(user) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_USERS, user)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateUser(user, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_USERS+id, user)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteUser(employeeId) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_USERS+employeeId)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchSupervisors() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_USERS+"Supervisors")
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching User Supervisors');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchNotInList(teamId) {
    	var deferred = $q.defer();
        $http.get(SERVICE_URI_USERS+"NotMembers/" + teamId)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching NotInList');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchEmployeeById(id) {
		var deferred = $q.defer();
		$http.get(SERVICE_URI_USERS+id)
		    .then(
		    function (response) {
		        deferred.resolve(response.data);
		    },
		    function(errResponse){
		        console.error('Error while fetching User: ' + id);
		        deferred.reject(errResponse);
		    }
		);
		return deferred.promise;
    }
}]);