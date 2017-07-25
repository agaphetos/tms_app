'use strict';

app.factory('TokenService', ['$http', '$q', function($http, $q){
	
    var SERVICE_URI_TOKEN = 'http://localhost:8080/tms_api/Security/Tokens';
    
    var factory = {
        fetchAllTokens:fetchAllTokens
    };

    return factory;
    
    function fetchAllTokens() {
        var deferred = $q.defer();
        $http.get(SERVICE_URI_TOKEN)
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                console.error('Error while fetching Token');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
}]);