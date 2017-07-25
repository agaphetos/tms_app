'use strict';

app.service('Session', function () {
    this.create = function (data) {
        this.id = data.employeeId;
        this.firstName = data.firstName;
        this.middleName = data.middleName;
        this.lastName = data.lastName;
        this.emailAddress = data.emailAddress;
        this.firstLog = data.firstLog;
        this.userRoles = [];
        angular.forEach(data.userRole, function (value, key) {
            this.push(value);
        }, this.userRoles);
    };
    this.invalidate = function () {
        this.id = null;
        this.firstName = null;
        this.lastName = null;
        this.emailAddress = null;
        this.userRoles = null;
    };
    return this;
});





