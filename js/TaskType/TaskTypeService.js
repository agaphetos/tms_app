'use strict';

app.factory('TaskTypeService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_TASKTYPE = 'http://localhost:8080/tms_api/TaskType/';
    
    var factory = {
        fetchAllTaskTypes:fetchAllTaskTypes,
        createTaskType:createTaskType,
        updateTaskType:updateTaskType,
        deleteTaskType:deleteTaskType,
    };
    
    return factory;
    
    function fetchAllTaskTypes() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TASKTYPE)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Task Types');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function createTaskType(taskType) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_TASKTYPE, taskType)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating Task Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateTaskType(taskType, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_TASKTYPE+id, taskType)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Task Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteTaskType(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_TASKTYPE+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting Task Type');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);