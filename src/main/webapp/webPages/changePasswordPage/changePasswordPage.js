/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var urlParams;
var requestEmail;

$(document).ready(function () {

    //document.getElementById("changePasswordForm").action = "/"+fitnessTrackerGlobals.serverApi.requests.frontController +"/"+ fitnessTrackerGlobals.serverApi.requests.changePasswordRequest;
    document.getElementById("loginPageForm").action = fitnessTrackerGlobals.serverApi.requests.LOGIN_PAGE_REQUEST;
    document.getElementById("forgotPasswordForm").action = fitnessTrackerGlobals.serverApi.requests.FORGOT_PASSWORD_PAGE_REQUEST;


    //var currentURL = window.location.href;
    //var identifierTokenSearchParameter = "?";
    //var identifierTokenLocation = currentURL.search(identifierTokenSearchParameter);
    //
    getQueryStringParameters(function ()
    {
        getEmail();
    });

    $('#changePasswordForm').submit(function (event) {
        event.preventDefault();
        if (globalValues.miscValues.passwordValid)
        {
            changePasswordRequestAjax();
        }
    });

    passwordStrengthTester("password", "confirmPassword", "passwordStrength");

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

});

/**
 * This is needed to get the unique identifier token that is attached to every single forgot password request
 * e.g http://localhost:8080/FrontControllerServlet/changePasswordPage?identifierToken=cf7a2606-5e7a-43e9-811b-abd8e55fc053
 * @param {type} callback
 * @returns {undefined}
 */
function getQueryStringParameters(callback)
{
    var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    if (callback)
    {
        callback();
    }
}

function getEmail()
{
    var inputObject = {};
    inputObject.identifierToken = urlParams.identifierToken;

    $.ajax({
        url: fitnessTrackerGlobals.serverApi.requests.GET_IDENTIFIER_TOKEN_EMAIL,
        type: "GET",
        data: inputObject,
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {

            if (returnObject.success === true)
            {
                requestEmail = returnObject.data.email;
            } else
            {
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\"> Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]
                        + "</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}

function changePasswordRequestAjax()
{
    var formData = $("#changePasswordForm").serializeArray();
    var inputObject = globalFunctions.convertFormArrayToJSON(formData);
    inputObject.identifierToken = urlParams.identifierToken;
    inputObject.email = requestEmail;
//    var identifierToken = {};
//    identifierToken.name = "identifierToken";
//    identifierToken.value = urlParams.identifierToken;

//    var email = {};
//    email.name = "email";
//    email.value = requestEmail;

//    formData.push(identifierToken);
//    formData.push(email);

    $.ajax({
        url: fitnessTrackerGlobals.serverApi.requests.CHANGE_PASSWORD_REQUEST,
        type: "POST",
        data: JSON.stringify(inputObject),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            document.getElementById("passwordStrength").innerHTML = "";
            if (returnObject.success === true)
            {
                console.log("valid credentials");
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Password changed successfully for email " + returnObject.data.email + "</div>";
            } else
            {
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]
                        + " please make a new change password request </div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}