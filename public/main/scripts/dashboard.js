'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: '../main/views/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {
        var d = new Date();
        var days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        $scope.date = d.getDate();
        $scope.day = days[d.getDay()];
        $scope.month = months[d.getMonth()];
        $scope.year = d.getFullYear();

        $http.get('tickets_average_day').success(function(data){
            var res = (""+data[0]['avg_day']).split('.');
            console.log(res);
            $scope.ticketDaily = res[0] + '.' + res[1].substring(0,2);
        });  
        $http.get('tickets_average_amount').success(function(data){
            var res = (""+data[0]['avg_total']).split('.');
            console.log(res);
            $scope.ticketAverage = res[0] + '.' + res[1].substring(0,2);
        });
        $http.get('tickets_average_items').success(function(data){
            $scope.ticketItems = data[0]['total_items'];
        });

        var line = document.getElementById("myLineChart");
        var myLineChart = new Chart(line, {
            type: 'line',
            data: {
                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",],
                datasets: [{
                    backgroundColor: '#0074D9',
                    data: [4000, 3000, -2100, 5600, -3200, 2000, -1500],
                    fill: true,
                }]
            },
            options: {
                legend: {
                    display: false,
                },
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Mes'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Promedio - Mensual'
                        }
                    }]
                }
            }
        });

        var pie = document.getElementById("myPieChart");
        var myPieChart = new Chart(pie, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        30,
                        15,
                        35,
                        20
                    ],
                    backgroundColor: [
                        '#FF4136',
                        '#0074D9',
                        '#2ECC40',
                        '#FF851B',
                    ],
                }],
                labels: [
                    "1",
                    "2",
                    "3",
                    "4"
                ]
            }
        });

        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                datasets: [{
                    data: [12, 19, 3, 5, 2, 3, 20],
                    backgroundColor: [
                        'rgba(218,165,32, 0.8)',
                        'rgba(0,128,128, 0.8)',
                        'rgba(0,100,0, 0.8)',
                        'rgba(178,34,34, 0.8)',
                        'rgba(138,43,226, 0.8)',
                        'rgba(255,69,0, 0.8)',
                        'rgba(128,128,128, 0.8)'
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }]);