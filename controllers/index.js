angular.module("app").controller("mainCtrl", function ($scope, $http) {
    $scope.title = 'Works';
    console.log($scope.title);

    $scope.crimeStageList = [
        {'id': 1, 'crimeName': 'Подготвока'},
        {'id': 2, 'crimeName': 'Покушение'},
        {'id': 3, 'crimeName': 'Оконченное'}
    ];

    console.log($scope.crimeStageList);


});
