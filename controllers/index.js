angular.module("app").controller("mainCtrl", function ($scope, $http) {
    $scope.title = 'Works';
    console.log($scope.title);

    $scope.crimeStageList = [
        {'id': 1, 'crimeName': 'Подготвока'},
        {'id': 2, 'crimeName': 'Покушение'},
        {'id': 3, 'crimeName': 'Оконченное'}
    ];


    $scope.myFunction = function () {
        console.log($scope.searchByNumber);
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/search-qualif-by-stat/',
            method: 'POST',
            data: {qualif_name: $scope.searchByNumber}
        }).then(function (data) {
            angular.forEach(data.data, function (value) {
                console.log(value);
                $scope.crimeList = value;
            })
        }, function (error) {
            console.log(error)
        })
    };


    $scope.sendRequest = function () {

        if ($scope.soft) {
            $scope.soft = 1;
        } else ($scope.soft = 0);
        if ($scope.heavy) {
            $scope.heavy = 1
        } else ($scope.heavy = 0);

        var today = new Date();
        var sendBodyObj = {
            'qualification': $scope.stage * 1,
            'crime_date': today.toLocaleDateString(),
            'article24': $scope.crime,
            'gender': $scope.gender * 1,
            'age': $scope.age,
            'soft': $scope.soft,
            'heavy': $scope.heavy
        };
        console.log(sendBodyObj);

        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/request/',
            method: 'POST',
            data: sendBodyObj
        }).then(function (value) {
            console.log(value)
        }, function (reason) {
            console.log(reason)
        })
    };


});
