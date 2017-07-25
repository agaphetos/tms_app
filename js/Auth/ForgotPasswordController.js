app.controller('ForgotPasswordController', ['$scope', 'UserService', 'SecurityService', '$location', '$timeout', function($scope, UserService, SecurityService, $location, $timeout) {
	$scope.notFound = true;
	$scope.notFoundError = false;
	$scope.answerNotMatch = true;
	$scope.answerNotMatchError = false;
	$scope.passwordNotMatchError = false;
    $scope.updateSuccess=false;
    $scope.firstLoginUserMessage=false;
	$scope.selectedIndex = 0;
	$scope.employeeId = null;
	
	function fetchEmployeeAnswers() {
		SecurityService.fetchEmployeeQuestions($scope.employeeId)
	        .then(
	        function(d) {
	        	$scope.securityAnswers = d;
	        	if ($scope.securityAnswers != null) {
		        	$scope.securityAnswer1 = $scope.securityAnswers[0];
		        	$scope.securityAnswer2 = $scope.securityAnswers[1];
		        	$scope.securityAnswer1.answer = null;
		        	$scope.securityAnswer2.answer = null;
	        	} else {
	        		$scope.securityAnswer1 = undefined;
	        		$scope.securityAnswer2 = undefined;
	        	}
    			nextTab();
	        },
	        function(errResponse){
	        	$scope.firstLoginUserMessage = true;
	        	$timeout(function(){
	        		$location.path("/");
	        	}, 2000);
	        }
	    );
	}
	
	function validateEmployeeAnswers(securityAnswers, employeeId) {
		SecurityService.validateEmployeeAnswers(securityAnswers, employeeId)
			.then(
	        function(d) {
	        	$scope.answerNotMatchError = false;
	        	$scope.answerNotMatch = false;
	        	nextTab();
	        },
	        function(errResponse){
	        	$scope.answerNotMatchError = true;
	        }
	    );
	}
	
	function resetPassword(newPassword, employeeId) {
		SecurityService.resetPassword(newPassword, employeeId)
			.then(
	        function(d) {
	        	$scope.updateSuccess=true;
	        	$timeout(function(){
	        		$location.path("/");
	        	}, 2000);
	        },
	        function(errResponse){
	            console.error('Error while updating Password.');
	            $scope.updateSuccess=false;
	        }
	    );
	}
	
	$scope.search = function() {
		UserService.fetchEmployeeById($scope.username)
			.then(
            function(d) {
            	if (d === "") {
            		$scope.notFound = true;
            		$scope.notFoundError = true;
            		return;
            	}
            	if (d != "" || d != undefined) {
            		$scope.employeeId = d.employeeId;
            		fetchEmployeeAnswers();
        			$scope.notFound = false;
        			$scope.notFoundError = false;
            	} else {
            		$scope.notFound = true;
            		$scope.notFoundError = true;
            	}
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
	}
	
	$scope.validateAnswers = function() {
		$scope.answerNotMatchError = false;
		$scope.securityAnswers = [];
		$scope.securityAnswer1.questionOrder = 1;
		$scope.securityAnswer2.questionOrder = 2;
		$scope.securityAnswers.push($scope.securityAnswer1);
		$scope.securityAnswers.push($scope.securityAnswer2);
		validateEmployeeAnswers($scope.securityAnswers, $scope.employeeId);
	}
	
	$scope.resetPassword = function() {
		if ($scope.newPassword !== $scope.confirmPassword) {
			$scope.passwordNotMatchError = true;
		} else {
			$scope.passwordNotMatchError = false;
			resetPassword($scope.newPassword, $scope.employeeId);
		}
	}
	
	function nextTab() {
		var index = $scope.selectedIndex + 1;
	    $scope.selectedIndex = index;
	}
}]);