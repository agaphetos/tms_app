'use strict';

app.controller('TaskController', ['$scope', 'TaskService', '$mdDialog', 'Session', function($scope, TaskService, $mdDialog, Session) {
    $scope.pageClass = 'tasks';
    $scope.employeeId = Session.id;
    
    $scope.initTask = initTask;
    $scope.create = create;
    $scope.create = create;
    $scope.edit = edit;
    $scope.reset = reset;
    $scope.setCompleted = setCompleted;
    $scope.setInProgress = setInProgress; 

    $scope.date = new Date();
    $scope.task = initTask();
    $scope.tasks = [];
    
    fetchEmployeeTasks();

    function fetchAllTasks() {
    	TaskService.fetchAllTasks()
            .then(
            function(d) {
                $scope.tasks = d;
            },
            function(errResponse){
                console.error('Error while fetching Tasks');
            }
        );
    }
    
    function fetchEmployeeTasks() {
    	TaskService.fetchEmployeeTasks($scope.employeeId)
            .then(
            function(d) {
                $scope.tasks = d;
            },
            function(errResponse){
                console.error('Error while fetching Employee Tasks');
            }
        );
    }
    
    function initTask () {
    	return {
    		taskId:null,
    		description:'',
    		createdDate:$scope.date,
    		employeeId:$scope.employeeId,
    		taskType:null,
    		externalRequestId:'',
    		remarks:'',
    		status:null,
    		applicationType:null    		
    	};
    }

	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(d, $event) {
		$scope.task = angular.copy(d);
		showForm($event, 1);
	};

    function reset(){
    	$scope.task = initTask();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
	
	 function setCompleted(task) {
		console.log('im here');
		$scope.task = task;
		$scope.task.status = {
			statusId:1,
			description:'Completed'
		};
        updateTask($scope.task, $scope.task.taskId);
        console.log('Task set to Completed with id ', $scope.task.taskId);
	}
	
	function setInProgress(task) {
		console.log('im here');
		$scope.task = task;
		$scope.task.status = {
			statusId:2,
			description:'In Progress'
		};
        updateTask($scope.task, $scope.task.taskId);
        console.log('Task set to In Progress with id ', $scope.task.taskId);
	}

    function updateTask(task, id){
        TaskService.updateTask(task, id)
            .then(
            fetchEmployeeTasks,
            function(errResponse){
                console.error('Error while updating Task');
            }
        );
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/TaskManagement/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  task: $scope.task,
			  initTask: $scope.initTask,
			  mode: mode
		  },
		  controller: FormController
		});
    };
    
    function FormController($scope, $mdDialog, Session, TaskService, ApplicationTypeService, TaskStatusService, TaskTypeService, task, initTask, mode) {
    	if (task.createdDate == null) {
			task.createdDate = new Date();
		} else {
	    	var createdDate = new Date(task.createdDate);
	    	task.createdDate = createdDate;
		}
		$scope.task = angular.copy(task);
    	$scope.applicationTypes = fetchAllApplicationTypes();
    	$scope.taskStatuses = fetchAllTaskStatuses();
    	$scope.taskTypes = fetchAllTaskTypes();
    	
        $scope.$watch('task.taskType', function (newValue, oldValue) {
        	if (newValue != oldValue) {
        		$scope.task.externalRequestId = '';
        		$scope.task.applicationType = null;
        		$scope.task.taskAddtlDetail = null;
        	}
        });
        
        $scope.$watch('task.status', function (newValue, oldValue) {
        	if (newValue != oldValue) {
        		$scope.task.completedDate = null;
        	}
        });
    	    		
	    function fetchAllApplicationTypes() {
        	ApplicationTypeService.fetchAllApplicationTypes()
                .then(
                function(d) {
                    $scope.applicationTypes = d;
                },
                function(errResponse){
                    console.error('Error while fetching Application Types');
                }
            );
        }
	    
	    function fetchAllTaskStatuses() {
	    	TaskStatusService.fetchAllTaskStatuses()
	            .then(
	            function(d) {
	                $scope.taskStatuses = d;
	            },
	            function(errResponse){
	                console.error('Error while fetching Task Statuses');
	            }
	        );
	    }

	    function fetchAllTaskTypes() {
	    	TaskTypeService.fetchAllTaskTypes()
	            .then(
	            function(d) {
	                $scope.taskTypes = d;
	            },
	            function(errResponse){
	                console.error('Error while fetching Task Types');
	            }
	        );
	    }
    	
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
    		if (task.taskId === null) {
    			$scope.task = initTask();
    		} else {
    			$scope.task = angular.copy(task);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New Task', $scope.task);
                createTask($scope.task);
                return true;
            } else {
                updateTask($scope.task, $scope.task.taskId);
                console.log('Task updated with id ', $scope.task.taskId);
                return true;
            }
            return false;
        }
        
        function createTask(task){
            TaskService.createTask(task)
                .then(
                fetchEmployeeTasks,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating Task');
                }
            );
        }

        function updateTask(task, id){
            TaskService.updateTask(task, id)
                .then(
                fetchEmployeeTasks,
                function(errResponse){
                    console.error('Error while updating Task');
                }
            );
        }
	};
}]);