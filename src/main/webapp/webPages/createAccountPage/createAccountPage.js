/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    document.getElementById("loginPageForm").action = serverAPI.requests.LOGIN_PAGE_REQUEST;

    $('#createAccountForm').submit(function (event) {
        event.preventDefault();

        if (globalValues.miscValues.passwordValid)
        {
            createAccountRequestAjax();
        }
    });

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

    //this adds an event from passwordStrength.js which controls globalValues.passwordValid
    passwordStrengthTester("password", "confirmPassword", "passwordStrength");

});

function createAccountRequestAjax()
{
    var formData = $("#createAccountForm").serializeArray();
    var inputObject = globalFunctions.convertFormArrayToJSON(formData);

    $.ajax({
        url: serverAPI.requests.CREATE_ACCOUNT_REQUEST,
        type: "POST",
        data: JSON.stringify(inputObject),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            document.getElementById("passwordStrength").innerHTML = "";

            if (returnObject.success === true)
            {
                console.log("valid credentials, accound created");
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Account created successfully for " + returnObject.data.email + "</div>";
            } else
            {
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + "</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}
