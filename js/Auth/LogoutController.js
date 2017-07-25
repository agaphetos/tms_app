'use strict';

app.controller('LogoutController', ['AuthSharedService', function(AuthSharedService) {
    AuthSharedService.logout();
}]);