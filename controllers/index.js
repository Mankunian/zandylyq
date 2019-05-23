angular.module("app").controller("mainCtrl", function ($scope, $http, $timeout) {

    $scope.getCrimeStageList = function () {
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment',
            method: 'GET'
        }).then(function (value) {
            console.log(value.data);
            $scope.judgment = value.data;
        }, function (reason) {
            console.log(reason)
        })
    };
    $scope.getCrimeStageList();


    $scope.getCrimeBySearch = function () {
        console.log($scope.item.searchByNumber);
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/search-qualif-by-stat/',
            method: 'POST',
            data: {qualif_name: $scope.item.searchByNumber}
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
    $scope.sendRequest = function (value) {
        console.log(value);
        $scope.object = value;
        var sendBodyObj = {
            'article_id': +value.crime,
            'crime_date': myDateString,
            'article24_id': +value.stage,
            'gender': +value.gender,
            'age': value.age,
            'soft': value.soft ? 1 : 0,
            'heavy': value.heavy ? 1 : 0
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
                        $scope.object.searchByNumber = '';
                        $scope.object.crime = '';
                        $scope.object.gender = '';
                        $scope.object.age = '';
                        $scope.object.soft = '';
                        $scope.object.heavy = '';
                        $scope.object.stage = {};
                        $scope.typeMessage = false;
                    }, 10000)
                }
            });


        }, function (reason) {
            console.log(reason)
        })
    };


});
