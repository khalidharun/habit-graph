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
	}]);
