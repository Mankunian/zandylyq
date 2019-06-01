var myApp = angular.module('app', ['ui.bootstrap', 'ngSanitize']);

angular.module('app').filter('trusted', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html)
    }
});

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

    /*$scope.equalCrime = [];
    $scope.getCrimeBySearch = function (search) {
        console.log(search);
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/search-qualif-by-stat/',
            method: 'POST',
            data: {qualif_name: $scope.item.searchByNumber}
        }).then(function (data) {
            angular.forEach(data.data, function (value) {
                $scope.crimeList = value;


                angular.forEach(value, function (item) {
                    // console.log(item.stat);
                    // console.log(search.searchByNumber);
                    var crimeItem = {};
                    if (search.searchByNumber === item.stat) {
                        crimeItem.id = item.id;
                        crimeItem.label = item.stat;
                        $scope.equalCrime.push(crimeItem)
                    }
                    // console.log($scope.equalCrime)

                })
            });
        }, function (error) {
            console.log(error)
        })
    };*/

    $scope.getCrimeList = function () {
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/',
            method: 'GET'
        }).then(function (data) {
            console.log(data);
            $scope.crimeList = data.data
        }, function (error) {
            console.log(error)
        })
    };
    $scope.getCrimeList();


    $scope.sendRequest = function (value) {
        console.log(value);

        $scope.dataSentByModal = value;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: modalContent,
            size: 'lg',
            resolve: {
                value: function () {
                    return $scope.dataSentByModal;
                },
                serverURL: function () {
                    return $scope.serverURL;
                }/*,
                article: function () {
                    return $scope.equalCrime
                }*/
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());

        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    };

    $scope.clearForm = function (value) {

        console.log(value.crime);
        $scope.crimeList = '';
        value.searchByNumber = '';
        value.crime = '';
        value.gender = '';
        value.age = '';
        value.soft = '';
        value.heavy = '';
        value.dateFrom = '';
        value.stage = {};
        $scope.typeMessage = false;

        $scope.getCrimeList();
        $scope.item = {}
    }


});


var modalContent = function ($scope, $uibModalInstance, $http, value) {

    /* angular.forEach(article, function (value) {
         $scope.articleId = value.id
     });*/

    console.log(value);

    var d = value.dateFrom;
    var mm = ((d.getMonth() < +1) < 10 ? '0' : '') + (d.getMonth() + 1);
    var dd = d.getDate();
    var yy = d.getFullYear();

    var myDateString = yy + '.' + mm + '.' + dd;

    $scope.heavy = false;
    $scope.showClearBtn = false;
    $scope.loader = false;
    $scope.getResponse = function () {
        var sendBodyObj = {
            // 'article_id': +value.searchByNumber,
            'article_id': value.crime,
            'crime_date': myDateString,
            'article24_id': +value.stage,
            'gender': +value.gender,
            'age': +value.age,
            'soft': value.soft ? 1 : 0,
            'heavy': value.heavy ? 1 : 0
        };
        $scope.loader = true;
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/request/?&nocache=2',
            method: 'POST',
            data: sendBodyObj,
            cache: false,
            contentType: false,
            async: true,
            processData: false,
            headers: {
                'Access-Control-Allow-Origin': true,
                'Content-Type': 'application/json; charset=utf-8',
                "X-Requested-With": "XMLHttpRequest"
                //"Cache-control": "no-cache"
            }
        }).then(function (data) {
            $scope.data = data;
            $scope.typeMessage = data.data;
            $scope.showClearBtn = true;
            $scope.showSendBtn = false;
            $scope.loader = false;
        }, function (reason) {
            console.log(reason)
        });

        $uibModalInstance.close();
    };
    $scope.getResponse();


    $scope.cancel = function () {
        $uibModalInstance.dismiss();
        /* $scope.crimeList = '';
         $scope.showSendBtn = true;
         $scope.showClearBtn = false;
         value.searchByNumber = '';
         value.crime = '';
         value.gender = '';
         value.age = '';
         value.soft = '';
         value.heavy = '';
         value.stage = {};
         value.dateFrom = '';
         $scope.typeMessage = false;*/

    };
};
