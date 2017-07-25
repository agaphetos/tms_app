'use strict';

app.factory('SecurityService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_SECURITY = 'http://localhost:8080/tms_api/Security/';
    
    var factory = {
        fetchAllQuestions:fetchAllQuestions,
        fetchEmployeeQuestions:fetchEmployeeQuestions,
        updateEmployeeAnswers:updateEmployeeAnswers,
        updateEmployeeFirstLog,updateEmployeeFirstLog,
        validateEmployeeAnswers:validateEmployeeAnswers,
        resetPassword:resetPassword,
        validatePassword:validatePassword
    };

    return factory;
    
    function fetchAllQuestions() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_SECURITY+"Questions")
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Security Questions');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchEmployeeQuestions(id) {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_SECURITY+"Answers/"+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Employee Security Answers');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
        
    function updateEmployeeAnswers(answers, id) {
        var deferred = $q.defer();
        console.log(id);
        console.log(JSON.stringify(answers));
        $http.post(SERVICE_URI_SECURITY+"Answers/"+id, answers)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Security Questions Answers');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function updateEmployeeFirstLog(id) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_SECURITY+"FirstLog/"+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating First Log Flag.');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function validateEmployeeAnswers(answers, id) {
    	var deferred = $q.defer();
        $http.post(SERVICE_URI_SECURITY+"Validate/"+id, answers)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while validating Security Questions Answers');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function resetPassword(password, id) {
    	var deferred = $q.defer();
        $http.post(SERVICE_URI_SECURITY+"Update/"+id+","+password)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Password');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function validatePassword(employeeId, currentPassword) {
    	var deferred = $q.defer();
        $http.post(SERVICE_URI_SECURITY+"Confirm/"+employeeId+","+currentPassword)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while validating Password');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);