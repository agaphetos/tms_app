'use strict';

app.controller('TeamController', ['$scope', 'TeamService', '$mdDialog', 'filterFilter', function($scope, TeamService, $mdDialog, filterFilter) {
	$scope.pageClass = 'teams';	
    $scope.teams = [];
    $scope.pagination = {
    		order:'teamId',
    		limit:5,
    		options:[5, 10],
    		pageNo:1,
    		itemCount:0
    	};

    $scope.initTeam = initTeam;
    $scope.create = create;
    $scope.edit = edit;
    $scope.remove = remove;
    $scope.reset = reset;
    $scope.showForm = showForm;
    $scope.showMembers = showMembers;

    $scope.team = initTeam();
    
    fetchAllTeams();

    function fetchAllTeams() {
        TeamService.fetchAllTeams()
            .then(
            function(d) {
                $scope.teams = d;
                $scope.pagination.itemCount=$scope.teams.length;
            },
            function(errResponse){
                console.error('Error while fetching Team');
            }
        );
    }

    $scope.$watch('search', function (newValue, oldValue) {
    	$scope.filtered = filterFilter($scope.teams, newValue);
    	$scope.pagination.itemCount=$scope.filtered.length;
    	$scope.pagination.pageNo=1;
    });

    function initTeam () {
    	return {
    		teamId:null,
    		description:'',
    		status:1
    	};
    }
    
    function deleteTeam(id){
        TeamService.deleteTeam(id)
            .then(
            	fetchAllTeams,
            function(errResponse){
                console.error('Error while deleting Team');
            }
        );
    }

	function create($event) {
		reset();
		showForm($event, 0);
	};
	
	function edit(team, $event) {
		$scope.team = angular.copy(team);
		showForm($event, 1);
	};

    function remove(id){
        console.log('id to be deleted', id);
        if($scope.team.teamId === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteTeam(id);
    }

    function reset(){
    	$scope.team = initTeam();
    	if ($scope.form !== undefined) {
    		$scope.form.$setPristine(); //reset Form
    	}
    }
    
    function showForm(ev, mode) {
		$mdDialog.show({
		  templateUrl: 'views/UserManagement/Team/Edit.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  team: $scope.team,
			  initTeam: $scope.initTeam,
			  mode: mode
		  },
		  controller: FormController
		});
    };

	function FormController($scope, $mdDialog, team, initTeam, mode) {
		$scope.team = angular.copy(team);
    	
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
    		if (team.teamId === null) {
    			$scope.team = initTeam();
    		} else {
    			$scope.team = angular.copy(team);
    		}
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}
    	}

        function submit() {
            if (mode == 0){
                console.log('Saving New Team', $scope.team);
                createTeam($scope.team);
                return true;
            } else {
                updateTeam($scope.team, $scope.team.teamId);
                console.log('Team updated with id ', $scope.team.teamId);
                return true;
            }
            return false;
        }
        
        function createTeam(team){
            TeamService.createTeam(team)
                .then(
                fetchAllTeams,
                function(errResponse){
                	console.error(errResponse);
                    console.error('Error while creating Team');
                }
            );
        }

        function updateTeam(team, id){
        	TeamService.updateTeam(team, id)
                .then(
                fetchAllTeams,
                function(errResponse){
                    console.error('Error while updating Team');
                }
            );
        }
	};
	
	function showMembers(team, ev) {
		$mdDialog.show({
		  templateUrl: 'views/UserManagement/Team/Members.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  locals: { 
			  team: team
		  },
		  controller: MemberController
		});
    };
    
    function MemberController($scope, $mdDialog, UserService, team) {
		$scope.team = angular.copy(team);		
		$scope.members = [];
		fetchTeamMembers();
		fetchNotMembers();
		
		function fetchTeamMembers() {
			TeamService.fetchTeamMembers($scope.team.teamId).then(
	            function(d) {
	            	if (d == "") {
	            		$scope.members = [];
	            	} else {
	            		$scope.members = d;
	            	}
	            },
	            function(errResponse){
	                console.error('Error while fetching Team Members.');
	            }
	        );
		}
		
		function fetchNotMembers() {
			UserService.fetchNotInList($scope.team.teamId).then(
	            function(d) {
	                $scope.employees = d;
	            },
	            function(errResponse){
	                console.error('Error while fetching Users.');
	            }
	        );
		}
    	
    	$scope.hide = function() {
    		$mdDialog.hide();
    	};
	
    	$scope.cancel = function() {
    		$mdDialog.cancel();
    	};
	
    	$scope.answer = function(answer) {
    		if (answer == 'reset') {
    			reset();
    		}
    		if (answer == 'submit' && $scope.form.$invalid) {
    			return;
    		} else if (answer == 'submit' && $scope.form.$valid) {
    			if (submit()) {
    				$mdDialog.hide(answer);
    			} else { console.log('failed.'); }
    		}
    	};
    	
    	function reset() {
        	if ($scope.form !== undefined) {
        		$scope.form.$setPristine(); //reset Form
        	}

    		fetchTeamMembers();
    		fetchNotMembers();
    	}
    	
    	$scope.add = function add(employee) {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
            $scope.members.push(employee);
    	}
    	
    	$scope.remove = function remove(member) {
            $scope.members.splice($scope.members.indexOf(member), 1);
            $scope.employees.push(member);
    	}

        function submit() {
        	if(saveTeamMembers($scope.members, $scope.team.teamId) != false){
        		return true;
        	} else { return false; }
        }
        
        function saveTeamMembers(members, teamId) {
        	TeamService.saveTeamMembers(members, teamId)
	            .then(
	            fetchAllTeams,
	            function(errResponse){
	                console.error('Error while updating Team Members');
	            	return false;
	            }
	        );
        }
	};
}]);
