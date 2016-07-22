/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function setupEvents(callback)
{

    //create macro datepicker
    $('#macroDatePicker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        format: "dd/mm/yyyy"
    });

    var currentlyStoredDate = globalFunctions.getCurrentlyViewedDate();
    $('#macroDatePicker').datepicker('setDate', currentlyStoredDate);
    $('#macroDatePicker').datepicker('update');


    $('#macroDatePicker').datepicker().on('changeDate', function () {
        var currentlyViewedDate = $('#macroDatePicker').datepicker('getUTCDate');
        globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        globalFunctionsAjax.getEatenFoodList(currentlyViewedDate, function ()
        {
            updateMacroLogPage();
        });
    });

    //listener for datepicker increment date buttons
    $(document).on("click", "#incrementMacroDateButton", function (e) {
        incrementDate();
    });

    //listener for datepicker decrement date buttons
    $(document).on("click", "#decrementMacroDateButton", function (e) {
        decrementDate();
    });

    if (callback)
    {
        callback();
    }
}

function incrementDate()
{
    console.log("incrementDate()");
    var currentlyViewedDate = globalFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() + 1);
    globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#macroDatePicker').datepicker('setDate', currentlyViewedDate);
}
function decrementDate()
{
    console.log("decrementDate()");
    var currentlyViewedDate = globalFunctions.getCurrentlyViewedDate();
    currentlyViewedDate.setDate(currentlyViewedDate.getDate() - 1);
    globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
    $('#macroDatePicker').datepicker('setDate', currentlyViewedDate);
}