'use strict';

app.factory('TeamService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_TEAM = 'http://localhost:8080/tms_api/Team/';
    
    var factory = {
        fetchAllTeams:fetchAllTeams,
        fetchTeamMembers:fetchTeamMembers,
        createTeam:createTeam,
        updateTeam:updateTeam,
        deleteTeam:deleteTeam,
        saveTeamMembers:saveTeamMembers
    };

    return factory;
    
    function fetchAllTeams() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TEAM)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Teams');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function fetchTeamMembers(id) {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TEAM+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Team Members');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function createTeam(team) {
        var deferred = $q.defer();
        $http.post(SERVICE_URI_TEAM, team)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
            	console.error(errResponse);
                console.error('Error while creating Team');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function updateTeam(team, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_TEAM+id, team)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Team');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

    function deleteTeam(id) {
        var deferred = $q.defer();
        $http.delete(SERVICE_URI_TEAM+id)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while deleting Team');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function saveTeamMembers(members, id) {
        var deferred = $q.defer();
        $http.put(SERVICE_URI_TEAM+"Members/"+id, members)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while updating Team Members');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);