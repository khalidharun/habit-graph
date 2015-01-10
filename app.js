angular.module('habitApp', [])
  .controller('GraphController', ['$rootScope', '$scope', function ($rootScope, $scope) {
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
    var data = {
      nodes: nodes,
      edges: edges
    };
    var container = document.getElementById('habitGraph');
    var options = {
			width: '100%',
			height: '400px',
      navigation: true,
			edges: {
				style: 'arrow'
			}
		};
		var network = new vis.Network(container, data, options);

    $scope.addNode = function (from, to) {
      var id1 = from.toLowerCase();
      var id2 = to.toLowerCase();
      if (!nodes.get(id1)) nodes.add({id: id1, label: from});
      if (!nodes.get(id2)) nodes.add({id: id2, label: to});
      edges.add({from: id1, to: id2});
    };

    $rootScope.$on("addHabit", function (event, habit) {
      $scope.addNode(habit.cue, habit.routine);
    });

    $rootScope.$on("resetHabits", function () {
      nodes.clear();
      edges.clear();
      $rootScope.$broadcast("requestHabits");
    });

    $rootScope.$broadcast("requestHabits");
  }])
	.controller('HabitController', ['$rootScope', '$scope', function ($rootScope, $scope) {

    $scope.init = function (reset) {
      if (reset) {
        $scope.habits = [
          {cue: 'Hear alarm', routine: 'Get out of bed', reward: 'untie knot #1'},
          {cue: 'Get out of bed', routine: 'Do Wudu', reward: 'untie knot #2'},
          {cue: 'Do Wudu', routine: 'Pray Fajr', reward: 'untie knot #3'}
        ];
        window.localStorage.setItem('habits', angular.toJson($scope.habits));
      } else {
        var storedHabits = window.localStorage.getItem('habits');
		    $scope.habits = (storedHabits) ? angular.fromJson(storedHabits) : [];
      }
      $rootScope.$broadcast('resetHabits');
    };

		$scope.addHabit = function () {
			$scope.habits.push($scope.habit);
      window.localStorage.setItem('habits', angular.toJson($scope.habits));
      $rootScope.$broadcast("addHabit", angular.copy($scope.habit));
			$scope.habit = {};
		};

    $rootScope.$on("requestHabits", function () {
      angular.forEach($scope.habits, function (habit) {
        $rootScope.$broadcast("addHabit", habit);
      });
    });

    $scope.init();
	}]);
