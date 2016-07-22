/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    
    localStorage.setItem("loginState", false);
    getServerAPI(function () {
        setupForms();
    });

    $('#loginForm').submit(function () {
        loginRequestAjax();
        return false;
    });

    $("#loginForm :input").change(function () {
        document.getElementById("feedback").innerHTML = "";
    });

    //auto selects form input text when clicked
    $(document).on('click', 'input', function () {
        this.select();
    });

});

function setupForms()
{
    //document.getElementById("loginForm").action = serverAPI.requests.LOGIN_REQUEST;
    document.getElementById("createAccountForm").action = serverAPI.requests.CREATE_ACCOUNT_PAGE_REQUEST;
    document.getElementById("forgotPasswordForm").action = serverAPI.requests.FORGOT_PASSWORD_PAGE_REQUEST;

    //autologin for development
    document.getElementById("email").value = "test@test.com";
    document.getElementById("password").value = "testtest";
}

/**
 * This gets the serverAPI object from the server. It is needed so the other
 * functions can make their requests using values from the serverAPI object. 
 * This is the only function that uses a hard coded request URL 
 * i.e "/FrontControlerServlet/GET_SERVER_API"
 * @param {type} callback
 * @returns serverAPI object in the form of:
 * 
 *  * {
 "serverAPI": {
 "errorCodes": {
 "10": "SAMPLE_ERROR1",
 "11": "SAMPLE_ERROR2",
 "12": "SAMPLE_ERROR3"
 
 },
 "requests": {
 "SAMPLE_REQUEST1": "/FrontControllerServlet/SAMPLE_REQUEST1",
 "SAMPLE_REQUEST2": "/FrontControllerServlet/SAMPLE_REQUEST2",
 "SAMPLE_REQUEST3": "/FrontControllerServlet/SAMPLE_REQUEST3"
 }
 }
 }
 */
function getServerAPI(callback)
{
    $.ajax({
        dataType: "json",
        type: "GET",
        url: "/FrontControllerServlet/GET_SERVER_API",
        success: function (returnObject)
        {
            console.log(returnObject);
            if (returnObject.success === true)
            {
                serverAPI = returnObject.data;
                localStorage.setItem("serverAPI", JSON.stringify(returnObject.data));
                if (callback)
                {
                    callback();
                }
            } else
            {
                console.log("Error 0: Failed to fetch API from server");
            }

        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}

/**
 * This function is called when the user attempts to login
 * 
 * @returns {undefined}
 */
function loginRequestAjax()
{
    //get data from form, it is formatted as an array of JSON objects with the
    //form data held in name/value pairs like so:
    //[{"name":"email", "value":"test@test.com"},{"name":"password", "value":"testtest"}]
    var formData = $("#loginForm").serializeArray();

    $.ajax({
        url: serverAPI.requests.LOGIN_REQUEST,
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("valid credentials, redirecting to main page");
                localStorage.setItem("loginState", true);

                window.location = serverAPI.requests.MACRO_LOG_PAGE_REQUEST;
            } else
            {
                document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + " please try again</div>";
            }
        },
        error: function (xhr, status, error)
        {
            console.log("Ajax request failed:" + error.toString());
        }
    });
}