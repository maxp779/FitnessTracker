/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var emailValid = false;

$(document).ready(function () {
    
    globalFunctions.setupNavbar();
    
    document.getElementById("deleteAccountForm").action = serverAPI.requests.DELETE_ACCOUNT_REQUEST;

    globalFunctions.refreshGlobalValuesFromLocalStorage(function () {
        globalFunctions.showSelectedAttributes();
    });

    //to tick/untick the checkboxes on the selected attributes form showing which are currently selected
    $('#editSelectedAttributesForm').submit(function (event) {
        event.preventDefault();

        var updatedFoodAttributes = jQuery.extend(true, {}, globalValues.userValues.foodAttributes)

        getNewFoodAttributes(updatedFoodAttributes, function ()
        {
            globalFunctionsAjax.updateSelectedAttributes(updatedFoodAttributes, function () {
                globalFunctions.showSelectedAttributes();
            });
        });
    });

    $('#changePasswordForm').submit(function (event) {
        event.preventDefault();
        if (globalValues.miscValues.passwordValid)
        {
            changePasswordRequestAjax();
        }
        else
        {
            console.log("password does not meet strength requirements");
        }
    });

    $('#changeEmailForm').submit(function (event) {
        event.preventDefault();
        if (globalValues.miscValues.emailValid)
        {
            changeEmailRequestAjax();
        }
        else
        {
            console.log("emails do not match");
        }
    });

    $("#changePasswordForm :input").focus(function () {
        document.getElementById("passwordFeedback").innerHTML = "";
    });

    $("#changeEmailForm :input").focus(function () {
        document.getElementById("emailFeedback").innerHTML = "";
    });

    $("#editSelectedAttributesForm :input").change(function () {
        document.getElementById("attributeFeedback").innerHTML = "";
    });

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

    //this adds an event from passwordStrength.js which gives user feedback and controls globalValues.miscValues.passwordValid
    passwordStrengthTester("newPassword", "confirmNewPassword", "passwordStrength");
    //this adds an event from emailValid.js which gives user feedback and controls globalValues.emailValid
    emailMatchValidator("newEmail", "confirmNewEmail", "emailFeedback");
});

function emailsMatch()
{
    return document.getElementById("newEmail").value === document.getElementById("confirmNewEmail").value;
}

function changePasswordRequestAjax()
{
    var formData = $("#changePasswordForm").serializeArray();
    var inputObject = globalFunctions.convertFormArrayToJSON(formData);

    $.ajax({
        url: serverAPI.requests.CHANGE_PASSWORD_REQUEST,
        type: "POST",
        data: JSON.stringify(inputObject),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("password changed");
                document.getElementById("passwordStrength").innerHTML = "";
                document.getElementById("changePasswordForm").reset();
                document.getElementById("passwordFeedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Password changed successfully for " + returnObject.data.email + "</div>";
            } else
            {
                document.getElementById("passwordStrength").innerHTML = "";
                document.getElementById("passwordFeedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + ", no action taken</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}

/**
 * Iterates through every food attribute in globalValues.userValues.foodAttributes
 * and updates the "t" or "f" values of food attributes that the user has changed
 * 
 * @param {type} updatedFoodAttributes - The new food attributes object that is intended to replace the old one
 * @param {type} callback
 * @returns {undefined}
 */
function getNewFoodAttributes(updatedFoodAttributes, callback) {
    for (var currentAttribute in globalValues.userValues.foodAttributes)
    {
        var currentAttributeElementName = currentAttribute + "checkbox";
        var currentElement = document.getElementById(currentAttributeElementName);
        //if the a checkbox matching the attribute exists, take appropriate action
        if (currentElement !== null)
        {
            if (currentElement.checked)
            {
                updatedFoodAttributes[currentAttribute] = "true";
            } else
            {
                updatedFoodAttributes[currentAttribute] = "false";
            }
        }
    }
    if (callback)
    {
        callback();
    }
}

function changeEmailRequestAjax()
{
    var formData = $("#changeEmailForm").serializeArray();
    var inputObject = globalFunctions.convertFormArrayToJSON(formData);
    $.ajax({
        url: serverAPI.requests.CHANGE_EMAIL_REQUEST,
        type: "POST",
        data: JSON.stringify(inputObject),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            //{"success":"true", "oldEmail":"123@123.com", "newEmail":"bawbags@baws.com", "errorCode":"13"}

            if (returnObject.success === true)
            {
                console.log("email changed");
                document.getElementById("changeEmailForm").reset();
                document.getElementById("emailFeedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Email changed successfully from "
                        + returnObject.data.oldEmail
                        + " to "
                        + returnObject.data.newEmail
                        + "</div>";
            } else
            {
                document.getElementById("emailFeedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + ", no action taken</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}