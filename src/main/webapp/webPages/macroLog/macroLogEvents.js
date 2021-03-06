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

    var currentlyStoredDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
    $('#macroDatePicker').datepicker('setDate', currentlyStoredDate);
    $('#macroDatePicker').datepicker('update');


    $('#macroDatePicker').datepicker().on('changeDate', function () {
        var currentlyViewedDate = $('#macroDatePicker').datepicker('getUTCDate');
        fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(currentlyViewedDate, function ()
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

