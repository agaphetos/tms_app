'use strict';

app.controller('TaskTypeController', ['$scope', 'TaskTypeService', '$mdDialog', 'filterFilter', function($scope, TaskTypeService, $mdDialog, filterFilter) {
    $scope.pageClass = 'taskTypes';
    $scope.taskTypes = [];
    $scope.pagination = {
    		order:'taskTypeId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};
    
    $scope.initTaskType = initTaskType;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;
    
    $scope.taskType = initTaskType();
    fetchAllTaskTypes();

    function fetchAllTaskTypes() {
    	TaskTypeService.fetchAllTaskTypes()
            .then(
            function(d) {
                $scope.taskTypes = d;
                $scope.pagination.itemCount=$scope.taskTypes.length;
            },
            function(errResponse){
                console.error('Error while fetching Task Types');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.taskTypes, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });


    function initTaskType () {
    	return {
    		taskTypeId:null,
    		description:''
    	};
    }
    
    function deleteTaskType(id){
    	TaskTypeService.deleteTaskType(id)
            .then(
            fetchAllTaskTypes,
            function(errResponse){
                console.error('Error while deleting TaskType');
            }
        );
    }
    
	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(taskType, $event) {
		$scope.taskType = angular.copy(taskType);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.taskType.taskTypeId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteTaskType(id);
    }

    function reset(){
    	$scope.taskType = initTaskType();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/TaskMaintenance/TaskType/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  taskType: $scope.taskType,
			  initTaskType: $scope.initTaskType,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, taskType, initTaskType, mode) {
		$scope.taskType = angular.copy(taskType);
    	
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
    		if (taskType.statusId === null) {
    			$scope.taskType = initTaskType();
    		} else {
    			$scope.taskType = angular.copy(taskType);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New Task Type', $scope.taskType);
                createTaskType($scope.taskType);
                return true;
            } else {
                updateTaskType($scope.taskType, $scope.taskType.taskTypeId);
                console.log('Task Type updated with id ', $scope.taskType.taskTypeId);
                return true;
            }
            return false;
        }
        
        function createTaskType(taskType){
        	TaskTypeService.createTaskType(taskType)
                .then(
                fetchAllTaskTypes,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating Task Type');
                }
            );
        }

        function updateTaskType(taskType, id){
        	TaskTypeService.updateTaskType(taskType, id)
                .then(
                fetchAllTaskTypes,
                function(errResponse){
                    console.error('Error while updating Task Type');
                }
            );
        }
	};
}]);