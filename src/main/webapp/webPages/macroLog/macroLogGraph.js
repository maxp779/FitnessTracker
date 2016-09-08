






function updateGraphs(callback)
{
    var totalMacrosTodayRef = fitnessTrackerGlobals.globalValues.userValues.totalMacrosToday;
    var userStatsRef = fitnessTrackerGlobals.globalValues.userValues.userStats;

    var proteinEaten = parseInt(totalMacrosTodayRef.protein);
    var carbohydrateEaten = parseInt(totalMacrosTodayRef.carbohydrate);
    var fatEaten = parseInt(totalMacrosTodayRef.fat);

    var proteinGoal = parseInt(userStatsRef.proteinGoal);
    var carbohydrateGoal = parseInt(userStatsRef.carbohydrateGoal);
    var fatGoal = parseInt(userStatsRef.fatGoal);

    var macroArray = [proteinEaten, carbohydrateEaten, fatEaten, proteinGoal, carbohydrateGoal, fatGoal];

    var macroChart;
    $(function () {
        // Create the chart
        macroChart = new Highcharts.Chart({
            // Create the chart
            chart: {
                renderTo: 'macroChart',
                type: 'bar'
            },
            title: {
                text: 'Todays macros & Macro goal',
            },
            xAxis: {
                categories: ['Protein', 'Protein goal', 'Carbohydrates', 'Carbohydrates goal', 'Fats', 'Fats goal']
            },
            yAxis: chartYAxis(macroArray, "Quantity (g)"),
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true

                    }
                }
            },
            tooltip: {
                enabled: false
            },
            series: [{
                    name: 'Protein',
                    showInLegend: false,
                }]
        });
    });

    macroChart.series[0].setData([{
            name: "Protein eaten",
            y: proteinEaten,
            color: "green"
        }, {
            name: "Protein goal",
            y: proteinGoal,
            color: "green"
        }, {
            name: "Carbohydrates eaten",
            y: carbohydrateEaten,
            color: "blue"
        }, {
            name: "Carbohydrates goal",
            y: carbohydrateGoal,
            color: "blue"
        }, {
            name: "Fats eaten",
            y: fatEaten,
            color: "orange"
        }, {
            name: "Fats goal",
            y: fatGoal,
            color: "orange"
        }]);

    var calorieGoal = parseInt(userStatsRef.tee);
    var calorieEaten = parseInt(totalMacrosTodayRef.calorie);
    var calorieArray = [calorieGoal, calorieEaten];
    var calorieChart;

    $(function () {
        // Create the chart
        calorieChart = new Highcharts.Chart({
            // Create the chart
            chart: {
                renderTo: 'calorieChart',
                type: 'bar'
            },
            title: {
                text: 'Todays calories & Calorie goal',
            },
            xAxis: {
                categories: ['Calories', 'Calorie allowance']
            },
            yAxis: chartYAxis(calorieArray, "Quantity (kcal)"),
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true

                    }
                }
            },
            tooltip: {
                enabled: false
            },
            series: [{
                    name: 'Protein',
                    showInLegend: false,
                }]
        });
    });

    calorieChart.series[0].setData([{
            name: "Calories eaten",
            y: calorieEaten,
            color: "red"
        }, {
            name: "Calorie goal",
            y: calorieGoal,
            color: "red"
        }]);

    if (callback)
    {
        callback();
    }
}

/**
 * This method is needed otherwise the chart looks weird with all zero values.
 * @param {type} macroArray
 * @returns {chartYAxis.yAxis}
 */
function chartYAxis(macroArray, titleText)
{
    var allZeroValues = true;
    var yAxis;

    for (var count = 0; count < macroArray.length; count++)
    {
        if (macroArray[count] === 0)
        {

        } else
        {
            allZeroValues = false;
        }
    }

    if (allZeroValues)
    {
        yAxis = {
            minPadding: 0,
            maxPadding: 0,
            min: 0,
            max: 1,
            showLastLabel: false,
            tickInterval: 1,
            title: {
                text: titleText
            }
        };
    } else
    {
        yAxis = {
            title: {
                text: titleText
            }
        };
    }

    return yAxis;
}