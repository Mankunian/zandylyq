angular.module("app").controller("graphCtrl", function ($scope, $http, $timeout, $uibModal, $log) {

    $scope.lineChart = function () {
        var object = {
            "article_id": "1880002",
            "article24_id": "3",
            "gender": 2,
            "age": 27,
            "soft": 0,
            "heavy": 0
        };


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
            $scope.typeOfPunishment = [];
            $scope.cntLic = [];
            angular.forEach($scope.data, function (row, index) {
                $scope.typeOfPunishment.push(row.VidNakaz);
                $scope.cntLic.push(+row.cntLic)
            });

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
                    // "min-value": 1383292800000,
                    // "shadow": 0,
                    // "step": 3600000,
                    /*"values": [
                         "штраф 200 МРА",
                         "общ.раб.200 час.",
                         "общ.раб.250 час.",
                         "общ.раб.300 час.",
                         "общ.раб.600 час.",
                         "штраф 200 МРА",
                         "общ.раб.200 час.",
                         "общ.раб.250 час.",
                         "общ.раб.300 час.",
                         "общ.раб.600 час.",
                         "штраф 200 МРА",
                         "общ.раб.200 час.",
                         "общ.раб.250 час.",
                         "общ.раб.300 час.",
                         "общ.раб.600 час."
                    ],*/
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
                    /*"transform": {
                        "type": "date",
                        "all": "%D, %d %M<br />%h:%i %A",
                        "guide": {
                            "visible": false
                        },
                        "item": {
                            "visible": false
                        }
                    },*/
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
                    "values": $scope.cntLic.sort(),
                    "text": "Кол-во лиц",
                    "line-color": "#007790",
                    "legend-marker": {
                        "type": "circle",
                        "size": 5,
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
                    },
                    "marker": {
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
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

        }, function (reason) {
            console.log(reason)
        })
    };
    $scope.lineChart();

    $scope.pieChart = function () {

        var object = {
            "article_id": "1880002",
            "article24_id": "3",
            "gender": 2,
            "age": 27,
            "soft": 0,
            "heavy": 0
        };

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
            var series = [];
            var i = 0;
            var color = ['#50ADF5', '#13c632', '#FFCB45', '#6877e5', '#6FB07F'];
            $scope.data = value.data.result;
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
                data: myConfig
                // height: 500,
                // width: 600
            });
        }, function (reason) {
            console.log(reason)
        });



    };
    $scope.pieChart();

});
