/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Setup code
$(document).ready(function () {

    globalFunctions.setupNavbar();

    setupEvents(function ()
    {
        globalFunctionsAjax.getAllClientData(function ()
        {
            updateFoodLogPage();
        });
    });

});

