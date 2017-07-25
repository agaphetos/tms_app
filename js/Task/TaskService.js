'use strict';

app.factory('TaskService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_TASK = 'http://localhost:8080/tms_api/Task/';
    
    var factory = {
        fetchAllTasks:fetchAllTasks,
        fetchEmployeeTasks:fetchEmployeeTasks,
        createTask:createTask,
        updateTask:updateTask,
        deleteTask:deleteTask,
    };
    
    return factory;
    
    function fetchAllTasks() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TASK)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Tasks');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchEmployeeTasks(id) {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TASK+"Employee/"+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Employee Tasks');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function createTask(task) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_TASK, task)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating Task');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateTask(task, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_TASK+id, task)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Task');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteTask(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_TASK+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting Task');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);