/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    $('#macroCalculatorForm').submit(function () {
        calculateMacros();
        return false;
    });

    $('#manualMacroForm').submit(function () {
        getNewMacros(function () {
            updateUserStats(fitnessTrackerGlobals.globalValues.tempValues.tempUserStatsManual);
        });
        return false;
    });

    $(document).on("click", "#saveCalculatedMacros", function (e) {
        console.log("saving calculated macros");
        updateUserStats(fitnessTrackerGlobals.globalValues.tempValues.tempUserStatsCalculated);
    });

//auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });


});

function getNewMacros(callback)
{
    var caloriesInProtein = 4;
    var caloriesInCarbs = 4;
    var caloriesInFat = 9;
    var tempUserStats = {};
    
    
    tempUserStats.proteinGoal = document.getElementById("proteinGoal").value;
    tempUserStats.carbohydrateGoal = document.getElementById("carbohydrateGoal").value;
    tempUserStats.fatGoal = document.getElementById("fatGoal").value;

    //fat has 9 calories per gram, protein and carbs both have 4 calories per gram. So to get
    //the total energy expenditure (calories) we must multiply accordingly e.g 160g of protein = 160*4 = 640 calories
    tempUserStats.teeGoal = (tempUserStats.fatGoal * caloriesInFat) + (tempUserStats.carbohydrateGoal * caloriesInCarbs)
            + (tempUserStats.proteinGoal * caloriesInProtein);
    
    fitnessTrackerGlobals.setGlobalValues.setTempUserStatsManual(tempUserStats);

    if (callback)
    {
        callback();
    }
}