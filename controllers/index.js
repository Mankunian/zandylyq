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
                console.log(value);
                $scope.crimeList = value;
            })
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
    console.log(typeof (myDateString));

    $scope.sendRequest = function () {

        if ($scope.soft === true) {
            $scope.soft = 1;
        } else ($scope.soft = 0);
        if ($scope.heavy === true) {
            $scope.heavy = 1
        } else ($scope.heavy = 0);

        console.log($scope.crime);
        var sendBodyObj = {
            'article_id': $scope.crime * 1,
            'crime_date': myDateString,
            'article24_id': $scope.stage * 1,
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
        }).then(function (data) {
            $scope.data = data;
            $scope.typeMessage = data.data;
            angular.forEach($scope.data, function (value) {
                console.log(value.result);
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
