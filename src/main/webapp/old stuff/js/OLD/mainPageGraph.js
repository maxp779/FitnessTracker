/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function graphSetup(callback)
    {
        $('#macroChart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Todays macros (g)'
            },
            xAxis: {
                categories: ['Protein', 'Carbs', 'Fat']
            },
            yAxis: {
//            min:0,
//            max:500,
                title: {
                    text: 'Quantity (g)'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                    name: "Todays macros",
                    showInLegend: false,
                    //data: [chartProtein, chartCarbohydrate, chartFat]
                }]
        });
        if (callback)
        {
            callback();
        }
    }
