'use strict';

angular.module('myApp.tables', ['ngRoute', 'ngTable'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tables', {
            templateUrl: '../main/views/tables.html',
            controller: 'TablesCtrl'
        });
    }])

    .controller('TablesCtrl', ['$scope', 'NgTableParams', '$filter', '$http', function ($scope, NgTableParams, $filter, $http) {

        //fecha única seleccionada
        $scope.activeDate = null;
        $scope.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        //rango de fechas
        $scope.selectedDatesMulti = [new Date().setHours(0, 0, 0, 0)];

        //activar botón de fecha única
        $scope.singleDateChosed = false;

        $scope.filename = '';

        //selección de fecha individual
        $scope.singleDateClick = function () {
            if (this.selectedDates.length===1) return;
            this.selectedDates.splice(0, 1);
            this.singleDateChosed = true;
        }

        //metodo html que obtiene los datos de la base de datos
        $http.get('/tickets').success(function(data){
            $scope.data = data;
            //poblar la tabla
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 25,
                reload: $scope.tableParams,
                total: $scope.data.length,
                counts: []
            }, { dataset: $scope.data });
        });

        /* Datos dummy, descomentar si no hay conexion con la BD para su visualizacion
        $scope.data = [
            { num_ticket: 1, Tienda: 'Starbucks', Sucursal: 'Arboledas', num_articulos: 1, Fecha: '10/10/2017', Total: 50 },
            { num_ticket: 2, Tienda: 'Starbucks', Sucursal: 'Satélite', num_articulos: 2, Fecha: '02/21/2016', Total: 120 },
            { num_ticket: 3, Tienda: 'C&A', Sucursal: 'Mundo E', num_articulos: 3, Fecha: '01/16/2017', Total: 250 },
            { num_ticket: 4, Tienda: 'MC Donalds', Sucursal: 'Polanco', num_articulos: 4, Fecha: '07/03/2015', Total: 300 },
            { num_ticket: 5, Tienda: 'Liverpool', Sucursal: 'Atizapán', num_articulos: 2, Fecha: '03/26/2017', Total: 800 },
            { num_ticket: 6, Tienda: 'Liverpool', Sucursal: 'Satélite', num_articulos: 1, Fecha: '02/13/2016', Total: 450 },
            { num_ticket: 7, Tienda: 'H&M', Sucursal: 'Mundo E', num_articulos: 1, Fecha: '12/08/2017', Total: 250 },
            { num_ticket: 8, Tienda: 'Zara', Sucursal: 'Atizapán', num_articulos: 2, Fecha: '10/03/2017', Total: 1000 }
        ];

        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 25,
            reload: $scope.tableParams,
            total: $scope.data.length,
            counts: []
        }, { dataset: $scope.data });*/

        //headers para el documento CSV
        $scope.headers = ['#Ticket', 'Tienda', 'Sucursal', '#Articulos', 'Fecha', 'Total']

        //método para nombrar el archivo CSV
        $scope.getFileName = function () {
            if($scope.selectedDates.length===1 && $scope.selectedDatesMulti.length===1 &&(!$scope.checkboxModel.value1 && !$scope.checkboxModel.value2)){
                var d = new Date();
                return 'Complete report of ' + $filter('date')(d, 'fullDate');
            }
            if($scope.checkboxModel.value1)
                return 'Report of '+ $filter('date')($scope.selectedDates[0], 'fullDate');
            return 'Report of '+ $filter('date')($scope.selectedDatesMulti[0], 'fullDate')+' - '+$filter('date')($scope.selectedDatesMulti[$scope.selectedDatesMulti.length-1], 'fullDate');
        }

        //método para obtener los elementos seleccionados de la tabla
        $scope.getData = function () {
            if($scope.selectedDates.length===1 && $scope.selectedDatesMulti.length===1 &&(!$scope.checkboxModel.value1 && !$scope.checkboxModel.value2))
                return $scope.data;
            else return $scope.newData;
        }

        //arreglo temporal para poblar la table
        $scope.newData = [];

        //método para filtar la tabla por fecha única
        $scope.clickOnlyDate = function () {
            $scope.newData = [];
            var tempDate = new Date(this.selectedDates[0]);
            //console.log(tempDate);
            $scope.data.forEach(function (e) {
                var temp = new Date(e.Fecha);
                if(tempDate.getFullYear()+tempDate.getMonth()+tempDate.getDay() === temp.getFullYear()+temp.getMonth()+temp.getDay()) {
                    $scope.newData.push(e);
                }
            });
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 25,
                reload: $scope.tableParams,
                total: $scope.newData.length,
                counts: []
            }, { dataset: $scope.newData });
        }

        //método para filtrar la tabla por un rango de fechas
        $scope.clickMultiDate = function () {
            $scope.newData = [];
            $scope.selectedDatesMulti.sort();
            var dateStart = new Date($scope.selectedDatesMulti[0]);
            var dateEnd = new Date($scope.selectedDatesMulti[$scope.selectedDatesMulti.length-1]);
            $scope.data.forEach(function (e) {
                var temp = new Date(e.Fecha);
                if(dateStart.getTime() <= temp.getTime() && dateEnd.getTime() >= temp.getTime()) {
                    $scope.newData.push(e);
                }
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 25,
                    reload: $scope.tableParams,
                    total: $scope.newData.length,
                    counts: []
                }, { dataset: $scope.newData });
            });

        }

        //controla la vista de selección de fechas única o por rango
        $scope.checkboxModel = {
            value1 : false,
            value2 : false
          };

    }]);