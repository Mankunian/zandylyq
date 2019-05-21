var angularFactories = angular.module('angular.factories', []);     //Define the directive module

angularFactories.factory('uiGridFactory', ['$http', '$rootScope', '$filter', 'uiGridConstants', 'uiGridExporterService', 'uiGridExporterConstants',
    function ($http, $rootScope, $filter) {

        var factory = {};

        factory.configureExporter = function (gridApi, page) {
            // Configuration done with gridOptions when initView() is run

            if (gridApi.grid == null || gridApi.grid.options == null) {
                return;
            }

            var gridOptions = gridApi.grid.options;
            // console.log(gridOptions);
            gridOptions.enableGridMenu = true;
            gridOptions.exporterMenuCsv = false;
            gridOptions.exporterMenuPdf = true;
            gridOptions.enableFullRowSelection = true;
            gridOptions.enableGroupHeaderSelection = true;

            // http://ui-grid.info/docs/#/api/ui.grid.exporter.api:GridOptions
            // https://github.com/angular-ui/ui-grid/issues/4214
            gridOptions.exporterFieldCallback = function (grid, row, col, value) {
                console.log(col);
                console.log(value);
                if (col.colDef.cellTemplate === 'ui-grid/date-cell' || col.colDef.type === 'date') {
                    value = $filter('date')(value, 'yyyy-MM-dd');
                }
                return value;
            };

            gridOptions.gridMenuCustomItems = [

                {
                    title: 'Экспортировать все в Excel',
                    action: function ($event) {

                        var sqlQuery = "SELECT ";
                        var list = [];
                        var headRu = [];
                        var item = [];
                        var itemSub = [];

                        // Build columns to get from the query
                        $.each(gridOptions.columnDefs, function (index, column) {
                            if (column.visible !== false && column.displayName) {
                                if (column.field != null && column.name != null && column.name.trim() !== "") {
                                    if ($.inArray(column.name, gridOptions.exporterSuppressColumns) === -1) {
                                        if (column.cellFilter != null && column.cellFilter !== "") {
                                            list.push('[' + column.field + '_fromCellFilter] AS ' + '[' + column.name + ']');
                                        } else if (column.cellTemplate === 'ui-grid/date-cell' || column.type === 'date') {
                                            list.push('[' + column.field + '_formattedDate] AS ' + '[' + column.name + ']');
                                        } else {
                                            list.push('[' + column.field + '] AS ' + '[' + column.name + ']');
                                        }
                                    }
                                }
                                // console.log(column);
                                headRu.push(column.name);
                            }
                        });

                        // console.log(headRu);

                        var rows = this.grid.rows;
                        var columns = this.grid.columns;
                        // Update cells that use cellFilter or cellTemplate
                        $.each(rows, function (index, row) {
                            $.each(headRu, function (count, data) {

                                if (data === row.entity) {
                                    $.each(columns, function (index, gridCol) {

                                        if (gridCol.cellFilter != null && gridCol.cellFilter !== "") {
                                            row.entity[gridCol.field + '_fromCellFilter'] = gridApi.grid.getCellDisplayValue(row, gridCol);
                                        } else {
                                            if (gridCol.colDef.cellTemplate === 'ui-grid/date-cell' || gridCol.colDef.type === 'date') {
                                                row.entity[gridCol.field + '_formattedDate'] = $filter('date')(row.entity[gridCol.field], 'yyyy-MM-dd');
                                            }
                                        }
                                    });
                                }
                            })
                        });

                        sqlQuery += list.join(', ');

                        sqlQuery += ' INTO XLSX("AVF.xlsx",{sheetid:"АВФ1", headers:true}) FROM ?';

                        //Функция формирующая дату

                        function formatDate(date) {
                            var monthNames = [
                                ".01", ".02", ".03",
                                ".04", ".05", "June", "July",
                                "August", "September", "October",
                                "November", "December"
                            ];

                            var day = date.getDate();
                            var monthIndex = date.getMonth();
                            var year = date.getFullYear();

                            return day + ' ' + monthNames[monthIndex] + ' ' + year;
                        }


                        if (page === 'replenishment') {
                            $.each(this.grid.options.data, function (index, row) {

                                var createdTime = $filter('date')(row.createdTime, 'dd.MM.y HH:mm');
                                var replenishmentTime = $filter('date')(row.replenishmentTime, 'dd.MM.y HH:mm');
                                var receivedTime = $filter('date')(row.receivedTime, 'dd.MM.y HH:mm');


                                // if (row.source && row.receivedTime !== 0 || row.busId !== null) {
                                if (row.source !== null) {
                                    item.push({
                                        'Карта': row.card.number,
                                        'Сумма': row.amount,
                                        'Получено': createdTime,
                                        'Пополнено': replenishmentTime,
                                        'Доставлено': receivedTime,
                                        'Источник': row.source.name,
                                        'Номер автобуса': row.busId
                                    })
                                } else {
                                    item.push({
                                        'Карта': row.card.number,
                                        'Сумма': row.amount,
                                        'Получено': createdTime,
                                        'Пополнено': replenishmentTime,
                                        'Доставлено': receivedTime,
                                        'Источник': '',
                                        'Номер автобуса': row.busId
                                    })
                                }


                            });


                            alasql('SELECT * INTO XLSX("Пополнения карт.xlsx",?) FROM ?', [{
                                sheetid: "Пополнения карт",
                                headers: true
                            }, item]);
                        }

                        if (page === 'card') {
                            var dateCreated = '01.01.1970 06:00';
                            var dateActivation = '01.01.1970 06:00';
                            var dateExp = '01.01.1970 06:00';
                            $.each(this.grid.options.data, function (index, row) {


                                var createdTimestamp = $filter('date')(row.createdTimestamp, 'dd.MM.y HH:mm');
                                var activationTimestamp = $filter('date')(row.activationTimestamp, 'dd.MM.y HH:mm');
                                var expirationTimestamp = $filter('date')(row.expirationTimestamp, 'dd.MM.y HH:mm');
                                var lastRefillTimestamp = $filter('date')(row.lastRefillTimestamp, 'dd.MM.y HH:mm');
                                var lastPaymentTimestamp = $filter('date')(row.lastPaymentTimestamp, 'dd.MM.y HH:mm');


                                if (createdTimestamp === dateCreated && activationTimestamp === dateActivation && expirationTimestamp === dateExp) {
                                    item.push({
                                        'Номер карты': row.number,
                                        'Номер счета': row.account,
                                        'Создано': '',
                                        'Дата активации': '',
                                        'Срок действия': '',
                                        'Баланс': row.balance,
                                        'Дата пополнения': '0',
                                        'Дата послед.оплаты': '0',
                                        'Тариф': row.tariff.name,
                                        'Статус': row.blocked
                                    });
                                } else {
                                    item.push({
                                        'Номер карты': row.number,
                                        'Номер счета': row.account,
                                        'Создано': createdTimestamp,
                                        'Дата активации': activationTimestamp,
                                        'Срок действия': expirationTimestamp,
                                        'Баланс': row.balance,
                                        'Дата пополнения': lastRefillTimestamp,
                                        'Дата послед.оплаты': lastPaymentTimestamp,
                                        'Тариф': row.tariff.name,
                                        'Статус': row.blocked
                                    })
                                }

                            });


                            alasql('SELECT * INTO XLSX("Транспортные карты.xlsx",?) FROM ?', [{
                                sheetid: "Пополнения карт",
                                headers: true
                            }, item]);
                        }


                    }
                    ,
                    order:
                        0
                }
                ,


                {
                    title: 'Экспортировать видимые в Excel',
                    action:

                        function ($event) {

                            var sqlQuery = "SELECT ";
                            var list = [];
                            var headRu = [];
                            var item = [];
                            var itemSub = {};

                            // Build columns to get from the query
                            $.each(gridOptions.columnDefs, function (index, column) {
                                if (column.visible != false && column.displayName) {
                                    if (column.field != null && column.name != null && column.name.trim() != "") {
                                        if ($.inArray(column.name, gridOptions.exporterSuppressColumns) == -1) {
                                            if (column.cellFilter != null && column.cellFilter != "") {
                                                list.push('[' + column.field + '_fromCellFilter] AS ' + '[' + column.name + ']');
                                            } else if (column.cellTemplate == 'ui-grid/date-cell' || column.type == 'date') {
                                                list.push('[' + column.field + '_formattedDate] AS ' + '[' + column.name + ']');
                                            } else {
                                                list.push('[' + column.field + '] AS ' + '[' + column.name + ']');
                                            }
                                        }
                                    }
                                    headRu.push(column.name);
                                }
                            });

                            console.log(headRu);

                            var rows = this.grid.rows;
                            var columns = this.grid.columns;
                            // Update cells that use cellFilter or cellTemplate
                            console.log(rows);
                            console.log(columns);


                            $.each(rows, function (index, row) {
                                $.each(columns, function (index, gridCol) {
                                    if (gridCol.visible == true) {
                                        if (gridCol.cellFilter != null && gridCol.cellFilter != "") {
                                            row.entity[gridCol.field + '_fromCellFilter'] = gridApi.grid.getCellDisplayValue(row, gridCol);
                                        } else {
                                            if (gridCol.colDef.cellTemplate == 'ui-grid/date-cell' || gridCol.colDef.type == 'date') {
                                                row.entity[gridCol.field + '_formattedDate'] = $filter('date')(row.entity[gridCol.field], 'yyyy-MM-dd');
                                            }
                                        }
                                    }

                                });
                            });

                            sqlQuery += list.join(', ');

                            sqlQuery += ' INTO XLSX("AVF.xlsx",{sheetid:"АВФ1", headers:true}) FROM ?';


                            //Функция формирующая дату

                            function formatDate(date) {
                                var monthNames = [
                                    ".01", ".02", ".03",
                                    ".04", ".05", "June", "July",
                                    "August", "September", "October",
                                    "November", "December"
                                ];

                                var day = date.getDate();
                                var monthIndex = date.getMonth();
                                var year = date.getFullYear();

                                return day + ' ' + monthNames[monthIndex] + ' ' + year;
                            }


                        }

                    ,
                    order: 1
                }

            ]
            ;

        }
        ;


        return factory;
    }
])
;
