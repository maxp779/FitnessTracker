/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
                    populateUserStats();
                    updateMyStatsPieChart();
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

