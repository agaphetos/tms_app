'use strict';

app.controller('UserRoleController', ['$scope', 'UserRoleService', '$mdDialog', 'filterFilter', function($scope, UserRoleService, $mdDialog, filterFilter) {
	$scope.pageClass = 'userRoles';	
    $scope.userRoles = [];
    $scope.pagination = {
    		order:'roleId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};

    $scope.initUserRole = initUserRole;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;

    $scope.userRole = initUserRole();
    
    fetchAllUserRoles();

    function fetchAllUserRoles() {
        UserRoleService.fetchAllUserRoles()
            .then(
            function(d) {
                $scope.userRoles = d;
                $scope.pagination.itemCount=$scope.userRoles.length;
            },
            function(errResponse){
                console.error('Error while fetching Users Roles');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.userRoles, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });

    function initUserRole () {
    	return {
    		roleId:null,
    		description:'',
    		isSupervisor:0,
    		status:1
    	};
    }
    
    function deleteUserRole(id){
        UserRoleService.deleteUserRole(id)
            .then(
            		fetchAllUserRoles,
            function(errResponse){
                console.error('Error while deleting User Role');
            }
        );
    }

	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(userRole, $event) {
		$scope.userRole = angular.copy(userRole);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.userRole.roleId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteUserRole(id);
    }

    function reset(){
    	$scope.userRole = initUserRole();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/UserManagement/UserRole/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  userRole: $scope.userRole,
			  initUserRole: $scope.initUserRole,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, userRole, initUserRole, mode) {
		$scope.userRole = angular.copy(userRole);
    	
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
    		if (userRole.roleId === null) {
    			$scope.userRole = initUserRole();
    		} else {
    			$scope.userRole = angular.copy(userRole);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New User Role', $scope.userRole);
                createUserRole($scope.userRole);
                return true;
            } else {
                updateUserRole($scope.userRole, $scope.userRole.roleId);
                console.log('User Role updated with id ', $scope.userRole.role);
                return true;
            }
            return false;
        }
        
        function createUserRole(userRole){
            UserRoleService.createUserRole(userRole)
                .then(
                fetchAllUserRoles,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating User Role');
                }
            );
        }

        function updateUserRole(userRole, id){
            UserRoleService.updateUserRole(userRole, id)
                .then(
                fetchAllUserRoles,
                function(errResponse){
                    console.error('Error while updating User Role');
                }
            );
        }
	};	
}]);
