angular.module('habitApp', [])
	.controller('HabitController', ['$scope', function($scope) {
    var storedHabits = window.localStorage.getItem('habits');
		$scope.habits = (storedHabits) ? angular.fromJson(storedHabits) : [];
		$scope.addHabit = function() {
			$scope.habits.push({
				cue: $scope.habit.cue,
				routine: $scope.habit.routine,
				reward: $scope.habit.reward
			});
			$scope.habit = {};
      window.localStorage.setItem('habits', angular.toJson($scope.habits));
		};
	}])
  .controller('GraphController', ['$scope', function($scope) {
    $scope.nodes = [];

    var storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      var habits = angular.fromJson(storedHabits);
      angular.forEach(habits, function(v,k) {
        var from = findNode(v.cue);
        var to = findNode(v.routine);

      });
    }


    $scope.addNode = function() {

    };
  }]);
;
