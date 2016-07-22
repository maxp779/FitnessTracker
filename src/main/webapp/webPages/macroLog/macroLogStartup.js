/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Setup code
$(document).ready(function () {

    globalFunctions.setupNavbar();
    
    globalFunctions.refreshGlobalValuesFromLocalStorage();

//    if(globalFunctions.isUndefinedOrNull(globalValues.miscValues.currentlyViewedDate))
//    {
//        globalValues.miscValues.currentlyViewedDate = new Date();
//    }

    setupEvents(function ()
    {
        globalFunctionsAjax.getAllClientData(function ()
        {
           // tempFunctionSetupDate(function () {
                updateMacroLogPage();
           // });
        });
    });

});

//function tempFunctionSetupDate(callback)
//{
//    if (globalFunctions.isUndefinedOrNull(globalValues.miscValues.currentlyViewedDate))
//    {
//        globalValues.miscValues.currentlyViewedDate = new Date();
//    }
//    if (callback)
//    {
//        callback();
//    }
//}
