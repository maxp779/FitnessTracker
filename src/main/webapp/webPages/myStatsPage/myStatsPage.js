
$(document).ready(function () {

    fitnessTrackerGlobals.commonFunctions.setupNavbar();

    if (!jQuery.isEmptyObject(fitnessTrackerGlobals.globalValues.tempValues.tempUserStatsCalculated))
    {
        myStatsVue.vueFunctions.createCalculatedMacroComponent();
    }

    myStatsPage.myStatsFunctions.updateMyStatsPieChart(function () {
        myStatsPage.setupEvents.setupAllEvents();
    });
});



var myStatsPage = function () {

    var setupEvents = function () {

        function setupAllEvents()
        {
            $(document).on("submit", "#macroCalculatorForm", function (e) {
                e.preventDefault();
                var formData = $('#macroCalculatorForm').serializeArray();
                var formDataObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                var tempUserStats = myStatsFunctions.calculateMacros(formDataObject);
                fitnessTrackerGlobals.setGlobalValues.setTempUserStatsCalculated(tempUserStats)
                myStatsVue.vueFunctions.createCalculatedMacroComponent();
            });

            $(document).on("submit", "#manualMacroForm", function (e) {
                e.preventDefault();
                var formData = $('#manualMacroForm').serializeArray();
                var formDataObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);

                //we calculate the calories for the user here
                formDataObject.teeGoal = fitnessTrackerGlobals.commonFunctions.calculateCalories(formDataObject.proteinGoal, formDataObject.carbohydrateGoal, formDataObject.fatGoal);
                myStatsAjax.updateUserStats(formDataObject);
            });

            $(document).on("click", "#saveCalculatedMacros", function (e) {
                console.log("saving calculated macros");
                myStatsAjax.updateUserStats(fitnessTrackerGlobals.globalValues.tempValues.tempUserStatsCalculated);
            });

            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });
        }
        return{
            setupAllEvents: setupAllEvents
        };
    }();

    var myStatsAjax = function () {
        function updateUserStats(updatedUserStats)
        {
            if (!fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(updatedUserStats))
            {
                $.ajax({
                    url: fitnessTrackerGlobals.serverApi.requests.MODIFY_USER_STATS,
                    type: "POST",
                    data: JSON.stringify(updatedUserStats),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (returnObject)
                    {
                        if (returnObject.success === true)
                        {
                            console.log("save user stats suceeded");
                            fitnessTrackerGlobals.setGlobalValues.setUserStats(returnObject.data);
                            myStatsFunctions.updateMyStatsPieChart();
                        } else
                        {
                            console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                        }
                    },
                    error: function (xhr, status, error)
                    {
                        console.log("Ajax request failed:" + error.toString());
                    }
                });
            } else
            {
                console.log("cannot save stats, no stats found");
            }
        }

        //myStatsAjax
        return{
            updateUserStats: updateUserStats
        };
    }();

    var myStatsFunctions = function () {

        /**
         * This function uses the "Mifflin-St Jeor" foruma to calculate sufficient macros based on the users goals, acitivity level
         * and other stats. The formula is documented throughout this function.
         * 
         * @param {type} formDataObject
         * @returns an object containing the users calculated stats
         */
        function calculateMacros(formDataObject)
        {
            var tempUserStats = {};
            tempUserStats.sex = formDataObject.sex;
            tempUserStats.weight = formDataObject.weight;
            tempUserStats.height = formDataObject.height;
            tempUserStats.age = formDataObject.age;
            tempUserStats.activitylevel = formDataObject.activityLevel;//this should be a float 
            tempUserStats.objective = formDataObject.objective;

            /**
             * Calculating BMR
             * BMR = Basic Metabolic Rate, this is calories required to stay alive   
             * MEN: BMR = [9.99 x weight (kg)] + [6.25 x height (cm)] - [4.92 x age (years)] + 5
             * WOMEN: BMR = [9.99 x weight (kg)] + [6.25 x height (cm)] - [4.92 x age (years)] -161
             */
            if (tempUserStats.sex === "m")
            {
                tempUserStats.bmr = Math.round((9.99 * tempUserStats.weight) + (6.25 * tempUserStats.height) - (4.92 * tempUserStats.age) + 5);
            } else
            {
                tempUserStats.bmr = Math.round((9.99 * tempUserStats.weight) + (6.25 * tempUserStats.height) - (4.92 * tempUserStats.age) - 161);
            }

            /**
             * Calculating TEE
             * TEE = Total Energy Expenditure, this is calories required including activity level to stay alive
             * TEE = BMR * activityLevel
             */
            tempUserStats.tee = tempUserStats.bmr * tempUserStats.activitylevel; //this should be a float

            /**
             * Calculating goalTEE
             * goalTEE = Goal Total Energy Expenditure based on the users goal, this is calories required including activity level to achieve the users goal
             * it is normally (TEE +15%) to gain weight or (TEE -15%) to lose weight
             */
            if (tempUserStats.objective === "gain")
            {
                tempUserStats.teeGoal = Math.round(tempUserStats.tee * 1.15);
            } else if (tempUserStats.objective === "lose")
            {
                tempUserStats.teeGoal = Math.round(tempUserStats.tee * 0.85);
            } else
            {
                tempUserStats.teeGoal = tempUserStats.tee;
            }

            /**
             * Calcuating the nutrient macros
             * proteinGoal = usersWeight * 2
             * fatGoal = usersWeight * 1
             * carbohydrateGoal =  carbohydratecalorie / 4
             * 
             * carbohydrateGoal is whatever is left of the goalTee after the proteinGoal and fatGoal calorie counts have been calculated
             * i.e  if goalTEE is 3000 and proteincalorie (not proteinGoal!) is 500 and fatcalorie is 500, then the rest of the calories must
             * be from carbohydrates. 1g of carbs = 4 calories so to get the remaining 2000 calories we need 500g of carbs.
             */
            tempUserStats.proteinGoal = tempUserStats.weight * 2;
            tempUserStats.fatGoal = tempUserStats.weight * 1;

            //calculate calorie breakdown
            tempUserStats.proteinCalorie = fitnessTrackerGlobals.commonFunctions.calculateCalories(tempUserStats.proteinGoal, 0, 0);
            tempUserStats.fatCalorie = fitnessTrackerGlobals.commonFunctions.calculateCalories(0, 0, tempUserStats.fatGoal);
            tempUserStats.carbohydrateCalorie = tempUserStats.teeGoal - (tempUserStats.proteinCalorie + tempUserStats.fatCalorie);

            tempUserStats.carbohydrateGoal = Math.round(tempUserStats.carbohydrateCalorie / 4);

            return tempUserStats;
        }

        function updateMyStatsPieChart(callback)
        {
            var currentMacroSplitPie;
            var userStatsRef = fitnessTrackerGlobals.globalValues.userValues.userStats;
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
                        text: ''
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

                var proteinGoal = parseInt(userStatsRef.proteinGoal);
                var carbohydrateGoal = parseInt(userStatsRef.carbohydrateGoal);
                var fatGoal = parseInt(userStatsRef.fatGoal);

                if (proteinGoal === 0 && carbohydrateGoal === 0 && fatGoal === 0)
                {
                    currentMacroSplitPie.series[0].setData([]);
                } else
                {
                    currentMacroSplitPie.series[0].setData([{
                            name: "Protein",
                            y: proteinGoal,
                            color: "green"
                        }, {
                            name: "Carbs",
                            y: carbohydrateGoal,
                            color: "blue"
                        }, {
                            name: "Fats",
                            y: fatGoal,
                            color: "orange"
                        }]);
                }
            });

            if (callback)
            {
                callback();
            }
        }
        return{
            calculateMacros: calculateMacros,
            updateMyStatsPieChart: updateMyStatsPieChart
        };
    }();

    //myStatsPage
    return{
        myStatsFunctions: myStatsFunctions,
        setupEvents: setupEvents
    };
}();
