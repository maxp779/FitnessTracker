/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function currentMacroSplitPieSetup(callback)
{
    var currentMacroSplitPie;
    $(function () {
        // Create the chart
        currentMacroSplitPie = new Highcharts.Chart({
            chart: {
                renderTo: 'currentMacroSplitPie',
                type: 'pie'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Current Macro Split (%)'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },
            plotOptions: {
                pie: {
                    shadow: false
                }
            },
            tooltip: {
                enabled: false
//                formatter: function() {
//                    return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
//                }
            },
            series: [{
                    name: 'Macro Split',
                    showInLegend: false,
                    data: [],
                    size: '40%',
                    innerSize: '60%',
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.point.name + ' ' + Math.round(this.percentage) + ' %';
                        },
                        distance: 10,
                        color: 'black'
                    }
                }]
        });
        
                if (goalMacroSplit["protein"] === 0 && goalMacroSplit["carbohydrate"] === 0 && goalMacroSplit["fat"] === 0)
        {
            currentMacroSplitPie.series[0].setData([]);
        }
        else
        {
            currentMacroSplitPie.series[0].setData([{
                    name: "Protein",
                    y: goalMacroSplit["protein"],
                    color: "green"
                }, {
                    name: "Carbohydrates",
                    y: goalMacroSplit["carbohydrate"],
                    color: "blue"
                }, {
                    name: "Fats",
                    y: goalMacroSplit["fat"],
                    color: "orange"
                }]);
        }
    });
    if(callback)
    {
        callback();
    }
}
