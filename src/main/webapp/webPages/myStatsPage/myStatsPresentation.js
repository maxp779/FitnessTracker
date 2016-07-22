/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//MEN: BMR = [9.99 x weight (kg)] + [6.25 x height (cm)] - [4.92 x age (years)] + 5
//WOMEN: BMR = [9.99 x weight (kg)] + [6.25 x height (cm)] - [4.92 x age (years)] -161
function calculateMacros()
{
    var tempUserStats = {};

    tempUserStats.sex = $('input[name="sex"]:checked').val();
    tempUserStats.weight = $('input[name="weight"]').val();
    tempUserStats.height = $('input[name="height"]').val();
    tempUserStats.age = $('input[name="age"]').val();
    tempUserStats.activitylevel = $('#activitylevel').val(); //this should be a float
    tempUserStats.goal = $('input[name="goal"]:checked').val();

    //BMR = Basic Metabolic Rate, this is calories required to stay alive   
    //calculate BMR
    if (tempUserStats.sex === "m")
    {
        tempUserStats.bmr = Math.round((9.99 * tempUserStats.weight) + (6.25 * tempUserStats.height) - (4.92 * tempUserStats.age) + 5);
    } else
    {
        tempUserStats.bmr = Math.round((9.99 * tempUserStats.weight) + (6.25 * tempUserStats.height) - (4.92 * tempUserStats.age) - 161);
    }

    //TEE = Total Energy Expenditure, this is calories required including activity level
    //calculate TEE
    tempUserStats.tee = tempUserStats.bmr * tempUserStats.activitylevel; //this should be a float

    //goalTEE = Ideal Total Energy Expenditure based on the users goal, it is normal TEE +15% to gain weight or -15% to lose weight
    //calculate goalTEE
    if (tempUserStats.goal === "gain")
    {
        tempUserStats.tee_goal = Math.round(tempUserStats.tee * 1.15);
    } else if (tempUserStats.goal === "lose")
    {
        tempUserStats.tee_goal = Math.round(tempUserStats.tee * 0.85);
    } else
    {
        tempUserStats.tee_goal = tempUserStats.tee;
    }

    //calculate nutrient macros
    tempUserStats.protein_goal = tempUserStats.weight * 2;
    tempUserStats.fat_goal = tempUserStats.weight * 1;

    //1g of protein = 4 calories, 1g of fat = 9 calories, 1g of carbs = 4 calories.
    tempUserStats.proteincalorie = tempUserStats.protein_goal * 4;
    tempUserStats.fatcalorie = tempUserStats.fat_goal * 9;
    tempUserStats.carbohydratecalorie = tempUserStats.tee_goal - (tempUserStats.proteincalorie + tempUserStats.fatcalorie);

    tempUserStats.carbohydrate_goal = tempUserStats.carbohydratecalorie / 4;
    console.log(JSON.stringify(tempUserStats));

    setGlobalValues.setTempUserStatsCalculated(tempUserStats, function () {
        updateCalculationResult();
    });
}

function updateCalculationResult()
{
    var calculationResultElement = document.getElementById("calculationResult");
    var innerHTML = "";
    var tempUserStatsRef = globalValues.tempValues.tempUserStatsCalculated;

    innerHTML = innerHTML.concat("<p><font color='green'>Daily protein: " + tempUserStatsRef.protein_goal + "</font></p>"
            + "<p><font color='blue'>Daily carbohydrates: " + tempUserStatsRef.carbohydrate_goal + "</font></p>"
            + "<p><font color='orange'>Daily fats: " + tempUserStatsRef.fat_goal + "</font></p>"
            + "<hr>"
            + "<p>Calories from protein: " + tempUserStatsRef.proteincalorie + "</p>"
            + "<p>Calories from carbohydrates: " + tempUserStatsRef.carbohydratecalorie + "</p>"
            + "<p>Calories from fats: " + tempUserStatsRef.fatcalorie + "</p>"
            + "<p>Total daily calories: " + tempUserStatsRef.tee_goal + "</p>"
            + "<hr>"
            + "<p>Any value shown may not be 100% accurate. Please consult your physician before starting any diet or nutrition plan.</p>");

    calculationResultElement.innerHTML = innerHTML;
}

function populateUserStats(callback)
{
    var currentStatsElement = document.getElementById("currentMacros");
    var innerHTML = "";
    var userStatsRef = globalValues.userValues.userStats;

    innerHTML = innerHTML.concat("<p><font color='green'>Daily protein: " + userStatsRef.protein_goal + "</font></p>"
            + "<p><font color='blue'>Daily carbohydrates: " + userStatsRef.carbohydrate_goal + "</font></p>"
            + "<p><font color='orange'>Daily fats: " + userStatsRef.fat_goal + "</font></p>"
            + "<hr>"
            + "<p>Calories from protein: " + (userStatsRef.protein_goal * 4) + "</p>"
            + "<p>Calories from carbohydrates: " + (userStatsRef.carbohydrate_goal * 4) + "</p>"
            + "<p>Calories from fats: " + (userStatsRef.fat_goal * 9) + "</p>"
            + "<p>Total daily calories: " + userStatsRef.tee + "</p>");

    currentStatsElement.innerHTML = innerHTML;

    if (callback)
    {
        callback();
    }
}

function updateMyStatsPieChart(callback)
{
    var currentMacroSplitPie;
    var userStatsRef = globalValues.userValues.userStats;
    $(function () {
        // Create the chart
        currentMacroSplitPie = new Highcharts.Chart({
            // Create the chart
            chart: {
                renderTo: 'currentMacroSplitPie',
                type: 'pie'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Current daily split (%)'
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
                    size: '35%',
                    innerSize: '60%',
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.point.name + ' ' + Math.round(this.percentage) + ' %';
                        },
                        distance: 5,
                        color: 'black'
                    }
                }]
        });

        var protein_goal = parseInt(userStatsRef.protein_goal);
        var carbohydrate_goal = parseInt(userStatsRef.carbohydrate_goal);
        var fat_goal = parseInt(userStatsRef.fat_goal);

        if (protein_goal === 0 && carbohydrate_goal === 0 && fat_goal === 0)
        {
            currentMacroSplitPie.series[0].setData([]);
        } else
        {
            currentMacroSplitPie.series[0].setData([{
                    name: "Protein",
                    y: protein_goal,
                    color: "green"
                }, {
                    name: "Carbs",
                    y: carbohydrate_goal,
                    color: "blue"
                }, {
                    name: "Fats",
                    y: fat_goal,
                    color: "orange"
                }]);
        }
    });

    if (callback)
    {
        callback();
    }
}