'use strict';

app.factory('ApplicationTypeService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_APPTYPE = 'http://localhost:8080/tms_api/ApplicationType/';
    
    var factory = {
        fetchAllApplicationTypes:fetchAllApplicationTypes,
        createApplicationType:createApplicationType,
        updateApplicationType:updateApplicationType,
        deleteApplicationType:deleteApplicationType,
    };
    
    return factory;
    
    function fetchAllApplicationTypes() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_APPTYPE)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Application Types');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function createApplicationType(applicationType) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_APPTYPE, applicationType)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating Application Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateApplicationType(applicationType, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_APPTYPE+id, applicationType)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Application Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteApplicationType(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_APPTYPE+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting Application Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);