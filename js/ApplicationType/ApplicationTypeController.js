'use strict';

app.controller('ApplicationTypeController', ['$scope', 'ApplicationTypeService', '$mdDialog', 'filterFilter', function($scope, ApplicationTypeService, $mdDialog, filterFilter) {
    $scope.pageClass = 'applicationTypes';
    $scope.applicationTypes = [];
    $scope.pagination = {
    		order:'applicationTypeId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};
    
    $scope.initApplicationType = initApplicationType;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;
    
    $scope.applicationType = initApplicationType();
    fetchAllApplicationTypes();

    function fetchAllApplicationTypes() {
    	ApplicationTypeService.fetchAllApplicationTypes()
            .then(
            function(d) {
                $scope.applicationTypes = d;
                $scope.pagination.itemCount=$scope.applicationTypes.length;
            },
            function(errResponse){
                console.error('Error while fetching Application Types');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.applicationTypes, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });


    function initApplicationType () {
    	return {
    		applicationTypeId:null,
    		applicationName:''
    	};
    }
    
    function deleteApplicationType(id){
    	ApplicationTypeService.deleteApplicationType(id)
            .then(
            fetchAllApplicationTypes,
            function(errResponse){
                console.error('Error while deleting ApplicationType');
            }
        );
    }
    
	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(applicationType, $event) {
		$scope.applicationType = angular.copy(applicationType);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.applicationType.applicationTypeId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteApplicationType(id);
    }

    function reset(){
    	$scope.applicationType = initApplicationType();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/TaskMaintenance/ApplicationType/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  applicationType: $scope.applicationType,
			  initApplicationType: $scope.initApplicationType,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, applicationType, initApplicationType, mode) {
		$scope.applicationType = angular.copy(applicationType);
    	
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
    		if (applicationType.applicationTypeId === null) {
    			$scope.applicationType = initApplicationType();
    		} else {
    			$scope.applicationType = angular.copy(applicationType);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New Application Type', $scope.applicationType);
                createApplicationType($scope.applicationType);
                return true;
            } else {
                updateApplicationType($scope.applicationType, $scope.applicationType.applicationTypeId);
                console.log('Application Type updated with id ', $scope.applicationType.applicationTypeId);
                return true;
            }
            return false;
        }
        
        function createApplicationType(applicationType){
        	ApplicationTypeService.createApplicationType(applicationType)
                .then(
                fetchAllApplicationTypes,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating Application Type');
                }
            );
        }

        function updateApplicationType(applicationType, id){
        	ApplicationTypeService.updateApplicationType(applicationType, id)
                .then(
                fetchAllApplicationTypes,
                function(errResponse){
                    console.error('Error while updating Application Type');
                }
            );
        }
	};
}]);