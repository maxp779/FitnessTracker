/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    document.getElementById("loginPageForm").action = fitnessTrackerGlobals.serverApi.requests.LOGIN_PAGE_REQUEST;

    $('#forgottenPasswordForm').submit(function () {
        event.preventDefault();
        forgottonPasswordRequestAjax();
        //return false;
    });

    $('#email').on('keyup', function (event) {
        document.getElementById("feedback").innerHTML = "";
    });

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

});



function forgottonPasswordRequestAjax()
{
    var formData = $("#forgottenPasswordForm").serializeArray();
    var inputObject = globalFunctions.convertFormArrayToJSON(formData);
    //var email = document.getElementById("email").value;

    $.ajax({
        url: fitnessTrackerGlobals.serverApi.requests.FORGOT_PASSWORD_EMAIL_REQUEST,
        type: "POST",
        data: JSON.stringify(inputObject),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("valid credentials");
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Email sent to " + returnObject.data.email + " with details on how to reset your password.</div>";
            } else
            {
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Error: " + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode] + "</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}