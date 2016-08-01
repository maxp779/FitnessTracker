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
    
    
    tempUserStats.protein_goal = document.getElementById("protein_goal").value;
    tempUserStats.carbohydrate_goal = document.getElementById("carbohydrate_goal").value;
    tempUserStats.fat_goal = document.getElementById("fat_goal").value;

    //fat has 9 calories per gram, protein and carbs both have 4 calories per gram. So to get
    //the total energy expenditure (calories) we must multiply accordingly e.g 160g of protein = 160*4 = 640 calories
    tempUserStats.teegoal = (tempUserStats.fat_goal * caloriesInFat) + (tempUserStats.carbohydrate_goal * caloriesInCarbs)
            + (tempUserStats.protein_goal * caloriesInProtein);
    
    fitnessTrackerGlobals.setGlobalValues.setTempUserStatsManual(tempUserStats);

    if (callback)
    {
        callback();
    }
}