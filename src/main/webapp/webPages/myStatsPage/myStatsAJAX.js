/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function updateUserStats(updatedUserStats)
{
    if (!globalFunctions.isUndefinedOrNull(updatedUserStats))
    {
        $.ajax({
            url: serverAPI.requests.MODIFY_USER_STATS,
            type: "POST",
            data: JSON.stringify(updatedUserStats),
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("save user stats suceeded");
                    setGlobalValues.setUserStats(returnObject.data);
                    populateUserStats();
                    updateMyStatsPieChart();
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
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

