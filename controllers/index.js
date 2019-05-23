angular.module("app").controller("mainCtrl", function ($scope, $http, $timeout) {

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
                $scope.crimeList = value;
            });
        }, function (error) {
            console.log(error)
        })
    };


    var d = new Date();
    // var mm = d.getMonth() + 1;
    var mm = ((d.getMonth() < +1) < 10 ? '0' : '') + (d.getMonth() + 1);
    var dd = d.getDate();
    var yy = d.getFullYear();

    var myDateString = yy + '.' + mm + '.' + dd;

    $scope.heavy = false;
    $scope.sendRequest = function () {

        var sendBodyObj = {
            'article_id': $scope.crime,
            'crime_date': myDateString,
            'article24_id': +$scope.stage,
            'gender': +$scope.gender,
            'age': $scope.age,
            'soft': $scope.soft ? 1 : 0,
            'heavy': $scope.heavy ? 1 : 0
        };
        console.log(sendBodyObj);

        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/request/',
            method: 'POST',
            data: sendBodyObj
        }).then(function (data) {
            $scope.data = data;
            $scope.typeMessage = data.data;
            angular.forEach($scope.data, function (value) {
                if (value.error_message) {
                    $timeout(function () {
                        $scope.searchByNumber = '';
                        $scope.crime = '';
                        $scope.gender = '';
                        $scope.age = '';
                        $scope.soft = '';
                        $scope.heavy = '';
                        $scope.stage = {};
                        $scope.typeMessage = false;
                    }, 10000)
                }
            });


        }, function (reason) {
            console.log(reason)
        })
    };


});
