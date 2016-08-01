/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Setup code
$(document).ready(function () {

    fitnessTrackerGlobals.commonFunctions.setupNavbar();  
    //fitnessTrackerGlobals.commonFunctions.refreshGlobalValuesFromLocalStorage();
console.log("macroLogStartup globalValues localStorage:");
console.log(JSON.parse(localStorage.getItem("globalValues")));
//console.log("macroLogStartup globalValues:"+JSON.stringify(fitnessTrackerGlobals.globalValues));


    setupEvents(function ()
    {
        fitnessTrackerGlobals.ajaxFunctions.getAllClientData(function ()
        {
            updateMacroLogPage();
        });
    });

});
