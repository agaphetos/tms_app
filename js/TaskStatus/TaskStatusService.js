'use strict';

app.factory('TaskStatusService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_TASKSTATUS = 'http://localhost:8080/tms_api/TaskStatus/';
    
    var factory = {
        fetchAllTaskStatuses:fetchAllTaskStatuses,
        createTaskStatus:createTaskStatus,
        updateTaskStatus:updateTaskStatus,
        deleteTaskStatus:deleteTaskStatus,
    };
    
    return factory;
    
    function fetchAllTaskStatuses() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TASKSTATUS)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Task Statuses');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function createTaskStatus(taskStatus) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_TASKSTATUS, taskStatus)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating Task Status');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateTaskStatus(taskStatus, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_TASKSTATUS+id, taskStatus)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Task Status');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteTaskStatus(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_TASKSTATUS+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting Task Status');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);