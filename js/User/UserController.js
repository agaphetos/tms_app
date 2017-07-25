'use strict';

app.controller('UserController', ['$scope', 'UserService', '$mdDialog', 'filterFilter', function($scope, UserService, $mdDialog, filterFilter) {
	$scope.pageClass = 'users';	
    $scope.users = [];
    $scope.userRoles = [];
    $scope.pagination = {
    		order:'employeeId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};

    $scope.initUser = initUser;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;

    $scope.date = new Date();
    $scope.user = initUser();
    
    fetchAllUsers();

    function fetchAllUsers() {
        UserService.fetchAllUsers()
            .then(
            function(d) {
                $scope.users = d;
                $scope.pagination.itemCount=$scope.users.length;
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.users, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });

    function initUser () {
    	return {
    		employeeId:null,
    		firstName:'',
    		lastName:'',
    		middleName:'',
    		emailAddress:'',
    		password:'',
    		status:1,
    		createdDate:$scope.date,
    		modifiedDate:'',
    		supervisorId:null,
    		userRole:null,
    		fullName:''
    	};
    }
    
    function deleteUser(id){
        UserService.deleteUser(id)
            .then(
            fetchAllUsers,
            function(errResponse){
                console.error('Error while deleting User');
            }
        );
    }

	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(d, $event) {
		$scope.user = angular.copy(d);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.user.employeeId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteUser(id);
    }

    function reset(){
    	$scope.user = initUser();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/UserManagement/User/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  user: $scope.user,
			  supervisors: $scope.supervisors,
			  initUser: $scope.initUser,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, UserService, UserRoleService, user, initUser, mode) {
	    fetchUserRoles();
	    fetchSupervisors();
	    
		if (user.createdDate == null) {
			user.createdDate = new Date();
		} else {
	    	var createdDate = new Date(user.createdDate);
	    	user.createdDate = createdDate;
		}
    	if (user.modifiedDate == null) {
    		user.modifiedDate = null;
    	} else {
        	var modifiedDate = new Date(user.modifiedDate);
        	user.modifiedDate = modifiedDate;
    	}
		$scope.user = angular.copy(user);
    	
    	$scope.hide = function() {
    		$mdDialog.hide();
    	};
	
    	$scope.cancel = function() {
    		reset();
    		$mdDialog.cancel();
    	};
	
    	$scope.answer = function(answer) {
    		if (answer == 'reset') {
    			reset();
    		}
    		if (answer == 'submit' && $scope.form.$invalid) {
    			return;
    		} else if (answer == 'submit' && $scope.form.$valid) {
    			console.log('submit executed.');
    			if (submit()) {
    				$mdDialog.hide(answer);
    			} else { console.log('failed.'); }
    		}
    	};
    	
    	function reset() {
    		if (user.employeeId === null) {
    			$scope.user = initUser();
    		} else {
    			$scope.user = angular.copy(user);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New User', $scope.user);
                createUser($scope.user);
                return true;
            } else {
            	$scope.user.modifiedDate = new Date();
                updateUser($scope.user, $scope.user.employeeId);
                console.log('User updated with id ', $scope.user.employeeId);
                return true;
            }
            return false;
        }
        
        function createUser(user){
            UserService.createUser(user)
                .then(
                fetchAllUsers,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating User');
                }
            );
        }

        function updateUser(user, id){
            UserService.updateUser(user, id)
                .then(
                fetchAllUsers,
                function(errResponse){
                    console.error('Error while updating User');
                }
            );
        }
        
        function fetchUserRoles() {
        	UserRoleService.fetchAllUserRoles()
    	        .then(
    	        function(d) {
    	            $scope.userRoles = d;
    	        },
    	        function(errResponse){
    	            console.error('Error while fetching Users');
    	        }
    	    );
        }
        
        function fetchSupervisors() {
        	UserService.fetchSupervisors()
    	        .then(
    	        function(d) {
    	            $scope.supervisors = d;
    	        },
    	        function(errResponse){
    	            console.error('Error while fetching Users');
    	        }
    	    );
        }
	};	
}]);
