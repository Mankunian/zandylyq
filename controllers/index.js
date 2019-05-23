angular.module("app").controller("mainCtrl", function ($scope, $http) {
    $scope.title = 'Works';
    console.log($scope.title);

    $scope.crimeStageList = [
        {'id': 1, 'crimeName': 'Подготвока'},
        {'id': 2, 'crimeName': 'Покушение'},
        {'id': 3, 'crimeName': 'Оконченное'}
    ];

    console.log($scope.crimeStageList);

    $scope.sendRequest = function () {

    };


    $scope.myFunction = function () {
        console.log($scope.searchByNumber);
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/search-qualif-by-stat/',
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            data: {qualif_name: $scope.searchByNumber}
        }).then(function (data) {
            console.log(data)
        }, function (error) {
            console.log(error)
        })
    }


});
