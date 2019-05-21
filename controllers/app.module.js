angular.module('app', [
    // 'ngAnimate',
    'ui.bootstrap',
    'ngRoute',
    // 'ngTouch',
    'ui.grid',
    'ui.grid.expandable',
    'ui.grid.selection',
    'ui.grid.pinning',
    'ui.grid.exporter',
    'angular.factories',
    'ui.grid.grouping',
    'ui.grid.resizeColumns',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    // 'ngSanitize',
    'ui.select',
    // 'rzModule',
    // 'AngularPrint',
    // 'ng-fusioncharts',
    // 'nvd3ChartDirectives',
    'zingchart-angularjs',
    // 'leaflet-directive',
    'angularjs-dropdown-multiselect',
    'chart.js',
    'angular.factories',
]);


angular.module('app').config(function ($routeProvider) {
    $routeProvider
        .when("/controllers/index", {
            templateUrl: "index.html"
        })

        .otherwise({redirectTo: '/'});
});
