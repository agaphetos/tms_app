'use strict';

app.controller('SecurityController', ['$scope', 'SecurityService', 'Session', '$location', '$timeout', function($scope, SecurityService, Session, $location, $timeout) {
	$scope.pageClass = 'security';
	$scope.incorrectPasswordError = false;
	$scope.incorrectPassword = true;
	$scope.passwordNotMatchError = false;
	$scope.updateSuccess = false; 
	$scope.employee = [];
	$scope.securityQuestions = [];
	$scope.securityAnswers = [];
	$scope.invalid = false;
	fetchAllQuestions();
	
	function fetchAllQuestions() {
		SecurityService.fetchAllQuestions()
	        .then(
	        function(d) {
	            $scope.securityQuestions = d;
	        },
	        function(errResponse){
	            console.error('Error while fetching Security Questions.');
	        }
	    );
	}
	
	function updateEmployeeAnswers(answers) {
		SecurityService.updateEmployeeAnswers(answers, Session.id)
	        .then(
	        function(d) {
	        	updateEmployeeFirstLog(Session.id);
	        },
	        function(errResponse){
	            console.error('Error while fetching Security Answers.');
	        }
	    );
	}
	
	function updateEmployeeFirstLog(id) {
		SecurityService.updateEmployeeFirstLog(id)
	        .then(
	        function(d) {
	        	$scope.updateSuccess=true;
	        	$timeout(function(){
	        		$location.path("/Home");
	        	}, 2000);
	        },
	        function(errResponse){
	            console.error('Error while fetching Updating First Log Flag.');
	        }
	    );
	}
	
	function validatePassword(currentPassword, employeeId) {
		$scope.incorrectPasswordError = false;
		SecurityService.validatePassword(employeeId, currentPassword)
			.then(
			function (d) {
				$scope.incorrectPassword = false;
				nextTab();
			},
			function(errResponse){
				console.error('Error while validating Password.');
				$scope.incorrectPasswordError = true;
        	}
		);
	}
	
	function resetPassword(newPassword, employeeId) {
		SecurityService.resetPassword(newPassword, employeeId)
			.then(
	        function(d) {
	        	$scope.updateSuccess=true;
	        	$timeout(function(){
	        		$location.path("/Logout");
	        	}, 2000);
	        },
	        function(errResponse){
	            console.error('Error while updating Password.');
	            $scope.updateSuccess=false;
	        }
	    );
	}
	
	$scope.update = function() {
		console.log('submit');
		if (!$scope.form.$invalid) {
			if ($scope.securityAnswer1.securityQuestion == $scope.securityAnswer2.securityQuestion) {
				$scope.invalid = true;
				return;
			} else {
				$scope.invalid = false;
				$scope.securityAnswers=[];
				$scope.securityAnswer1.questionOrder = 1;
				$scope.securityAnswer2.questionOrder = 2;
				$scope.securityAnswers.push($scope.securityAnswer1);
				$scope.securityAnswers.push($scope.securityAnswer2);
				updateEmployeeAnswers($scope.securityAnswers);
			}
		}
	}
	
	$scope.reset = function() {
    	if ($scope.form !== undefined) {
    		fetchEmployeeAnswers();
			$scope.invalid = false;
    		$scope.form.$setPristine(); //reset Form
    	}
	}
	
	$scope.validate = function() {
		validatePassword($scope.currentPassword, Session.id);
	}
	
	$scope.resetPassword = function() {
		if ($scope.newPassword !== $scope.confirmPassword) {
			$scope.passwordNotMatchError = true;
		} else {
			$scope.passwordNotMatchError = false;
			resetPassword($scope.newPassword, Session.id);
		}
	}
	
	function nextTab() {
		var index = $scope.selectedIndex + 1;
	    $scope.selectedIndex = index;
	}
}]);