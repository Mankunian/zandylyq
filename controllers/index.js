var myApp = angular.module('app', ['ui.bootstrap']);

angular.module("app").controller("mainCtrl", function ($scope, $http, $timeout, $uibModal, $log) {

    $scope.showSendBtn = true;

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


    $scope.sendRequest = function (value) {
        $scope.dataSentByModal = value;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: modalContent,
            size: 'md',
            resolve: {
                value: function () {
                    return $scope.dataSentByModal;
                },
                serverURL: function () {
                    return $scope.serverURL;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            $scope.crimeList = '';
            $scope.showSendBtn = true;
            $scope.showClearBtn = false;
            value.searchByNumber = '';
            value.crime = '';
            value.gender = '';
            value.age = '';
            value.soft = '';
            value.heavy = '';
            value.stage = {};
            $scope.typeMessage = false;
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    };


});


var modalContent = function ($scope, $uibModalInstance, $http, value) {

    var d = new Date();
    var mm = ((d.getMonth() < +1) < 10 ? '0' : '') + (d.getMonth() + 1);
    var dd = d.getDate();
    var yy = d.getFullYear();

    var myDateString = yy + '.' + mm + '.' + dd;

    $scope.heavy = false;
    $scope.showClearBtn = false;
    $scope.getResponse = function () {
        var sendBodyObj = {
            'article_id': +value.crime,
            'crime_date': myDateString,
            'article24_id': +value.stage,
            'gender': +value.gender,
            'age': +value.age,
            'soft': value.soft ? 1 : 0,
            'heavy': value.heavy ? 1 : 0
        };

        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/request/',
            method: 'POST',
            data: sendBodyObj
        }).then(function (data) {
            $scope.data = data;
            $scope.typeMessage = data.data;
            $scope.showClearBtn = true;
            $scope.showSendBtn = false;
        }, function (reason) {
            console.log(reason)
        });

        $uibModalInstance.close();
    };
    $scope.getResponse();




    $scope.cancel = function () {
        $uibModalInstance.dismiss();
        $scope.crimeList = '';
        $scope.showSendBtn = true;
        $scope.showClearBtn = false;
        value.searchByNumber = '';
        value.crime = '';
        value.gender = '';
        value.age = '';
        value.soft = '';
        value.heavy = '';
        value.stage = {};
        $scope.typeMessage = false;

    };
};
