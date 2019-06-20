var myApp = angular.module('app', ['ui.bootstrap', 'ngSanitize', 'ui.select']);

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

    $scope.singleDemo = {};
    $scope.singleDemo.crime = '';
    $scope.getCrimeList = function () {
        $http({
            url: 'http://api.zandylyq.kz/v1/judgment/',
            method: 'GET'
        }).then(function (data) {
            console.log(data);
            $scope.crimeList = data.data;

            localStorage.setItem("crimeList", JSON.stringify($scope.crimeList.articles));
        }, function (error) {
            console.log(error)
        })
    };
    $scope.getCrimeList();


    $scope.selectedStage = '3';
    $scope.sendRequest = function (value, singleDemo, selectedStage) {


        // console.log(value);
        // console.log(singleDemo);
        // console.log(selectedStage);

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
                },
                article: function () {
                    return singleDemo.crime
                },
                stage: function () {
                    return selectedStage
                }

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

    $scope.clearForm = function (value, crimeList) {

        console.log(crimeList);
        $scope.crimeList = '';
        value.searchByNumber = '';
        value.gender = '';
        value.age = '';
        value.soft = '';
        value.heavy = '';
        value.dateFrom = '';
        value.stage = {};
        $scope.typeMessage = false;

        $scope.getCrimeList();
        $scope.item = {};
        crimeList.crime = {};
    }


});


var modalContent = function ($scope, $uibModalInstance, $http, value, article, stage) {

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
            'article_id': article.id,
            'crime_date': myDateString,
            'article24_id': +stage,
            'gender': +value.gender,
            'age': +value.age,
            'soft': value.soft ? 1 : 0,
            'heavy': value.heavy ? 1 : 0
        };

        $scope.objForChart = sendBodyObj;
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
            }
        }).then(function (data) {
            $scope.data = data;
            $scope.typeMessage = data.data;
            if ($scope.typeMessage.error_message) {
                $scope.typeMessage.error_message = 'Пожалуйста, заполните поля где отмечены знаком *'
            }
            $scope.showClearBtn = true;
            $scope.showSendBtn = false;
            $scope.loader = false;
        }, function (reason) {
            console.log(reason)
        });

        $uibModalInstance.close();
    };
    $scope.getResponse();


    $scope.showTable = false;
    $scope.showChart = function () {
        // $scope.showTable = true;
        console.log($scope.objForChart);

        var object = {
            "article_id": $scope.objForChart.article_id,
            "article24_id": $scope.objForChart.article24_id,
            "gender": $scope.objForChart.gender,
            "age": $scope.objForChart.age,
            "soft": $scope.objForChart.soft,
            "heavy": $scope.objForChart.heavy
        };

        /*var object = {
            "article_id": "1880002",
            "article24_id": "3",
            "gender": 2,
            "age": 27,
            "soft": 0,
            "heavy": 0
        };*/

        $http({
            method: 'POST',
            url: 'http://api.zandylyq.kz/v1/stat/vid-nakaz/',
            data: object,
            cache: false,
            contentType: false,
            async: true,
            processData: false,
            headers: {
                'Access-Control-Allow-Origin': true,
                'Content-Type': 'application/json; charset=utf-8',
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(function (value) {
            $scope.data = value.data.result;
            if ($scope.data === '') {
                $scope.noData = 'Нет данных'
            } else {
                var series = [];
                var i = 0;
                var color = ['#50ADF5', '#13c632', '#FFCB45', '#6877e5', '#6FB07F'];

                console.log($scope.data);
                angular.forEach($scope.data, function (value) {
                    var obj = {
                        values: [+value.cntLic],
                        text: value.VidNakaz,
                        backgroundColor: color[i]
                    };
                    series.push(obj);
                    console.log(obj);
                    i++;
                });

                var myConfig = {
                    type: "pie",
                    backgroundColor: "#003849",
                    // "background-color": "#003849",
                    plot: {
                        borderColor: "#fff",
                        borderWidth: 5,
                        // slice: 90,
                        valueBox: {
                            placement: 'out',
                            // text: '%t\n%npv%',
                            text: '%t\n%v',
                            fontFamily: "Open Sans"
                        },
                        tooltip: {
                            fontSize: '18',
                            fontFamily: "Open Sans",
                            padding: "5 10",
                            text: "%v"
                        },
                        animation: {
                            effect: 2,
                            method: 5,
                            speed: 500,
                            sequence: 1
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        console.log('IT works');
                                    }
                                }
                            }
                        }
                    },
                    source: {
                        // text: 'gs.statcounter.com',
                        fontColor: "#8e99a9",
                        fontFamily: "Open Sans"
                    },
                    title: {
                        fontColor: "#fff",
                        text: 'Вид и сроки наказания',
                        align: "center",
                        offsetX: 10,
                        fontFamily: "Open Sans",
                        fontSize: 25,
                        backgroundColor: "none"
                    },
                    subtitle: {
                        offsetX: 10,
                        offsetY: 10,
                        fontColor: "#8e99a9",
                        fontFamily: "Open Sans",
                        fontSize: "13",
                        text: 'Кол-во лиц',
                        align: "left"
                    },
                    plotarea: {
                        // margin: "20 0 0 0"
                    },
                    series: series
                };

                zingchart.render({
                    id: 'pieChart',
                    data: myConfig,
                    // height: 500,
                    width: '100%'
                });

                $scope.hideBtn = false;
            }
        }, function (reason) {
            console.log(reason)
        });
    };

    $scope.lineChart = function () {

        var object = {
            "article_id": $scope.objForChart.article_id,
            "article24_id": $scope.objForChart.article24_id,
            "gender": $scope.objForChart.gender,
            "age": $scope.objForChart.age,
            "soft": $scope.objForChart.soft,
            "heavy": $scope.objForChart.heavy
        };


        /*var object = {
            "article_id": "1880002",
            "article24_id": "3",
            "gender": 2,
            "age": 27,
            "soft": 0,
            "heavy": 0
        };*/


        $http({
            method: 'POST',
            url: 'http://api.zandylyq.kz/v1/stat/vid-nakaz/',
            data: object,
            cache: false,
            contentType: false,
            async: true,
            processData: false,
            headers: {
                'Access-Control-Allow-Origin': true,
                'Content-Type': 'application/json; charset=utf-8',
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(function (value) {
            console.log(value);
            $scope.data = value.data.result;
            $scope.tooltip = value.data.result;
            $scope.typeOfPunishment = [];
            $scope.cntLic = [];
            angular.forEach($scope.data, function (row, index) {
                $scope.typeOfPunishment.push(row.VidNakaz);
                $scope.cntLic.push(+row.cntLic)
            });

            console.log($scope.cntLic);

            $scope.cntLic.reduce(function (acc, value) {
                return acc + value;
            }, 0);


            $scope.totalSum = $scope.cntLic.reduce(addSum, 0);

            function addSum(a, b) {
                return a + b;
            }

            ZC.LICENSE = ["b55b025e438fa8a98e32482b5f768ff5"];
            zingchart.THEME = "classic";
            var myConfig = {
                "type": "line",
                "background-color": "#003849",
                "utc": true,
                "title": {
                    "y": "7px",
                    "text": "Вид и сроки наказания",
                    "background-color": "#003849",
                    "font-size": "24px",
                    "font-color": "white",
                    "height": "25px"
                },
                "plotarea": {
                    "margin": "20% 8% 14% 12%",
                    "background-color": "#003849"
                },
                "legend": {
                    "layout": "float",
                    "background-color": "none",
                    "border-width": 0,
                    "shadow": 0,
                    "text-align": "middle",
                    "offsetY": 35,
                    "align": "center",
                    "item": {
                        "font-color": "#f6f7f8",
                        "font-size": "14px"
                    }
                },
                "scale-x": {
                    "values": $scope.typeOfPunishment,
                    "line-color": "#f6f7f8",
                    "tick": {
                        "line-color": "#f6f7f8"
                    },
                    "guide": {
                        "line-color": "#f6f7f8"
                    },
                    "item": {
                        "font-color": "#f6f7f8"
                    },
                    "label": {
                        "visible": true
                    },
                    "minor-ticks": 0
                },
                "scale-y": {
                    // "values": "0:10:0",
                    "line-color": "#f6f7f8",
                    "shadow": 0,
                    "tick": {
                        "line-color": "#f6f7f8"
                    },
                    "guide": {
                        "line-color": "#f6f7f8",
                        "line-style": "dashed"
                    },
                    "item": {
                        "font-color": "#f6f7f8"
                    },
                    "label": {
                        "text": "Всего лиц:" + $scope.totalSum,
                        "font-color": "#f6f7f8"
                    },
                    "minor-ticks": 0,
                    "thousands-separator": ","
                },
                "crosshair-x": {
                    "line-color": "#f6f7f8",
                    "plot-label": {
                        "border-radius": "5px",
                        "border-width": "1px",
                        "border-color": "#f6f7f8",
                        "padding": "10px",
                        "font-weight": "bold"
                    },
                    "scale-label": {
                        "font-color": "#00baf0",
                        "background-color": "#f6f7f8",
                        "border-radius": "5px"
                    }
                },
                "tooltip": {
                    "visible": false
                },
                "plot": {
                    "tooltip-text": "%t views: %v<br>%k",
                    "shadow": 0,
                    "line-width": "3px",
                    "marker": {
                        "type": "circle",
                        "size": 3
                    },
                    "hover-marker": {
                        "type": "circle",
                        "size": 4,
                        "border-width": "1px"
                    }
                },
                "series": [{
                    // "values": [15, 25, 10, 5, 38, 30, 11, 15, 20, 22, 17, 28, 39, 40, 27],
                    "values": $scope.cntLic,
                    "text": "Кол-во лиц",
                    "line-color": "#ff0000",
                    "legend-marker": {
                        "type": "circle",
                        "size": 5,
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
                    },
                    "marker": {
                        "background-color": "#ffff00",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#ffff00"
                    }
                }
                ]
            };

            zingchart.render({
                id: 'myChart',
                data: myConfig
                // height: 500,
                // width: 600
            });


            $scope.callTable = [];
            zingchart.node_click = function (config) {
                /*отправить эти 2 параметра чтобы получить список для таблицы*/
                // console.log(config.value);
                console.log(config.scaletext);

                var tableObj = {
                    "article_id": $scope.objForChart.article_id,
                    "article24_id": $scope.objForChart.article24_id,
                    "gender": $scope.objForChart.gender,
                    "age": $scope.objForChart.age,
                    "soft": $scope.objForChart.soft,
                    "heavy": $scope.objForChart.heavy,
                    "VidNakaz": config.scaletext
                };
                console.log(tableObj);

                $http({
                    method: 'POST',
                    url: 'http://api.zandylyq.kz/v1/stat/vid-nakaz-list/',
                    data: tableObj,
                    cache: false,
                    contentType: false,
                    async: true,
                    processData: false,
                    headers: {
                        'Access-Control-Allow-Origin': true,
                        'Content-Type': 'application/json; charset=utf-8',
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then(function (value) {
                    console.log(value);
                    $scope.showTable = true;
                    $scope.tableData = value.data.result;
                }, function (reason) {
                    console.log(reason)
                })


            };

        }, function (reason) {
            console.log(reason)
        })
    };
    // $scope.lineChart();

    $scope.downloadFile = function (item) {
        console.log(item);
        $http({
            method: 'GET',
            url: 'http://api.zandylyq.kz/v1/file/download/' + item.file_id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        }).success(function (response) {
            var file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            // saveAs(file, 'filename.docx');
        }).error(function (data) {

        })
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
};
