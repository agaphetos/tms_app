'use strict';

app.controller('TaskStatusController', ['$scope', 'TaskStatusService', '$mdDialog', 'filterFilter', function($scope, TaskStatusService, $mdDialog, filterFilter) {
    $scope.pageClass = 'taskStatus';
    $scope.taskStatuses = [];
    $scope.pagination = {
    		order:'statusId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};
    
    $scope.initTaskStatus = initTaskStatus;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;
    
    $scope.taskStatus = initTaskStatus();
    fetchAllTaskStatuses();

    function fetchAllTaskStatuses() {
    	TaskStatusService.fetchAllTaskStatuses()
            .then(
            function(d) {
                $scope.taskStatuses = d;
                $scope.pagination.itemCount=$scope.taskStatuses.length;
            },
            function(errResponse){
                console.error('Error while fetching Task Statuses');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.taskStatuses, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });


    function initTaskStatus () {
    	return {
    		statusId:null,
    		description:''
    	};
    }
    
    function deleteTaskStatus(id){
    	TaskStatusService.deleteTaskStatus(id)
            .then(
            fetchAllTaskStatuses,
            function(errResponse){
                console.error('Error while deleting TaskStatus');
            }
        );
    }
    
	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(taskStatus, $event) {
		$scope.taskStatus = angular.copy(taskStatus);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.taskStatus.statusId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteTaskStatus(id);
    }

    function reset(){
    	$scope.taskStatus = initTaskStatus();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/TaskMaintenance/TaskStatus/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  taskStatus: $scope.taskStatus,
			  initTaskStatus: $scope.initTaskStatus,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, taskStatus, initTaskStatus, mode) {
		$scope.taskStatus = angular.copy(taskStatus);
    	
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
    		if (taskStatus.statusId === null) {
    			$scope.taskStatus = initTaskStatus();
    		} else {
    			$scope.taskStatus = angular.copy(taskStatus);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New Task Status', $scope.taskStatus);
                createTaskStatus($scope.taskStatus);
                return true;
            } else {
                updateTaskStatus($scope.taskStatus, $scope.taskStatus.statusId);
                console.log('Task Status updated with id ', $scope.taskStatus.statusId);
                return true;
            }
            return false;
        }
        
        function createTaskStatus(taskStatus){
        	TaskStatusService.createTaskStatus(taskStatus)
                .then(
                fetchAllTaskStatuses,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating Task Status');
                }
            );
        }

        function updateTaskStatus(taskStatus, id){
        	TaskStatusService.updateTaskStatus(taskStatus, id)
                .then(
                fetchAllTaskStatuses,
                function(errResponse){
                    console.error('Error while updating Task Status');
                }
            );
        }
	};
}]);