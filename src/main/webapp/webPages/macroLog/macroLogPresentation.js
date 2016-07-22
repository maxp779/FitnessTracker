/**
 * increment the viewDate the user is looking at
 * these two functions are used with the buttons near the datepickers
 * they will change the datepickers internal states
 * @returns {undefined}
 */


//figure this one out later...
//var sort_by = function (field, reverse, primer) {
//
//    var key = primer ?
//            function (x) {
//                return primer(x[field])
//            } :
//            function (x) {
//                return x[field]
//            };
//
//    reverse = !reverse ? 1 : -1;
//
//    return function (a, b) {
//        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
//    }
//}


/**
 * This function calculated the total macros for all the foods eaten on the currently
 * selected date.
 * @param {type} callback
 * @returns {undefined}
 */
function calculateTotalMacros(callback)
{
    var totalMacrosToday = {};
    var eatenFoodsArrayRef = globalValues.userValues.eatenFoodsArray;

    for (var index = 0; index < eatenFoodsArrayRef.length; index++)
    {
        var currentFoodJSON = eatenFoodsArrayRef[index];
        for (var aProperty in currentFoodJSON)
        {
            //if non operable e.g "foodname" then ignore
            if (globalValues.miscValues.nonOperableAttributes.indexOf(aProperty) === -1 && !globalFunctions.isUndefinedOrNull(currentFoodJSON[aProperty]))
            {
                //if first occurrance of aProperty
                if (globalFunctions.isUndefinedOrNull(totalMacrosToday[aProperty]))
                {
                    totalMacrosToday[aProperty] = parseInt(currentFoodJSON[aProperty]);
                } else
                {
                    totalMacrosToday[aProperty] = parseInt(totalMacrosToday[aProperty]) + parseInt(currentFoodJSON[aProperty]);
                }
            }
        }
    }

    if (globalFunctions.isUndefinedOrNull(totalMacrosToday.protein))
    {
        totalMacrosToday.protein = 0;
    }
    if (globalFunctions.isUndefinedOrNull(totalMacrosToday.carbohydrate))
    {
        totalMacrosToday.carbohydrate = 0;
    }
    if (globalFunctions.isUndefinedOrNull(totalMacrosToday.fat))
    {
        totalMacrosToday.fat = 0;
    }
    if (globalFunctions.isUndefinedOrNull(totalMacrosToday.calorie))
    {
        totalMacrosToday.calorie = 0;
    }
    console.log("calculateTotalMacros(): " + JSON.stringify(totalMacrosToday));

    setGlobalValues.setTotalMacrosToday(totalMacrosToday);

    if (callback)
    {
        callback();
    }
}


function updateGraphs(callback)
{
    var totalMacrosTodayRef = globalValues.userValues.totalMacrosToday;
    var userStatsRef = globalValues.userValues.userStats;

    var proteinEaten = parseInt(totalMacrosTodayRef.protein);
    var carbohydrateEaten = parseInt(totalMacrosTodayRef.carbohydrate);
    var fatEaten = parseInt(totalMacrosTodayRef.fat);

    var proteinGoal = parseInt(userStatsRef.protein_goal);
    var carbohydrateGoal = parseInt(userStatsRef.carbohydrate_goal);
    var fatGoal = parseInt(userStatsRef.fat_goal);

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



function updateMacrosNeededPanel()
{
    var userStatsRef = globalValues.userValues.userStats;
    var totalMacrosTodayRef = globalValues.userValues.totalMacrosToday;

    var macroPanel = document.getElementById("currentMacros");
    var innerHTML = "";
    var proteinNeeded = parseInt(userStatsRef.protein_goal) - parseInt(totalMacrosTodayRef.protein);
    var carbohydrateNeeded = parseInt(userStatsRef.carbohydrate_goal) - parseInt(totalMacrosTodayRef.carbohydrate);
    var fatNeeded = parseInt(userStatsRef.fat_goal) - parseInt(totalMacrosTodayRef.fat);
    var calorieRemaining = parseInt(userStatsRef.tee) - parseInt(totalMacrosTodayRef.calorie);

    if (proteinNeeded <= 0)
    {
        proteinNeeded = " Goal reached <span class='glyphicon glyphicon-ok'></span>";
    }
    if (carbohydrateNeeded <= 0)
    {
        carbohydrateNeeded = " Goal reached <span class='glyphicon glyphicon-ok'></span>";
    }
    if (fatNeeded <= 0)
    {
        fatNeeded = " Goal reached <span class='glyphicon glyphicon-ok'></span>";
    }
    if (calorieRemaining <= 0)
    {
        calorieRemaining = " Goal reached <span class='glyphicon glyphicon-ok'></span>";
    }


    innerHTML = innerHTML.concat("<p><font color='green'>Protein needed: " + proteinNeeded + "</font></p>"
            + "<p><font color='blue'>Carbs needed: " + carbohydrateNeeded + "</font></p>"
            + "<p><font color='orange'>Fats needed: " + fatNeeded + "</font></p>"
            + "<hr>"
            + "<p>Calories left to eat: " + calorieRemaining + "</p>");

    macroPanel.innerHTML = innerHTML;
}

function updateMacroLogPage()
{
    calculateTotalMacros(function () {
        updateGraphs(function () {
            updateMacrosNeededPanel();
        });
    });
}