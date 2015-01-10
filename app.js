angular.module('habitApp', ['ngLodash', 'uuid4'])
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
  .controller('HabitController', ['$rootScope', '$scope', 'lodash', 'uuid4', function ($rootScope, $scope, _, uuid4) {
    function saveHabits() {
      window.localStorage.setItem('habits', angular.toJson($scope.habits));
    }
    
    $scope.init = function (reset) {
      if (reset) {
        $scope.habits = [
          {cue: 'Hear alarm', routine: 'Get out of bed', reward: '10 pts'},
          {cue: 'Get out of bed', routine: 'Use the bathroom', reward: '20 pts'},
          {cue: 'Use the bathroom', routine: 'Go to the Gym', reward: '30 pts'}
        ];
      } else {
        var storedHabits = window.localStorage.getItem('habits');
        $scope.habits = (storedHabits) ? angular.fromJson(storedHabits) : [];
      }
      // Make sure habits have uuids
      $scope.habits = _.map($scope.habits, function(item) {
        return _.defaults(item, {uuid: uuid4.generate()});
      });
    };

    $scope.addHabit = function () {
      $scope.habit.uuid = uuid4.generate();
      $scope.habits.push($scope.habit);
      $scope.habit = {};
    };

    $scope.dropHabit = function (uuid) {
      _.remove($scope.habits, function(item) {return item.uuid == uuid;});
    };

    $rootScope.$on("requestHabits", function () {
      angular.forEach($scope.habits, function (habit) {
        $rootScope.$broadcast("addHabit", habit);
      });
    });

    $scope.$watchCollection('habits', function (newHabits, oldHabits) {
      saveHabits();
      $rootScope.$broadcast('resetHabits');   
    });
    
    $scope.init();
  }]);
