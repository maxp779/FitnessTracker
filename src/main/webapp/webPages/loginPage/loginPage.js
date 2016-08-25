/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {

    localStorage.setItem("loginState", "false");
    localStorage.removeItem("currentlyViewedDate");


    /**
     * This gives globals.js time to fetch the serverApi, even if this proves
     * to be not enough time the serverApi will be fetched by setupLoginPage()
     * should serverApi equal undefined or null.
     * 
     * This just prevents the serverApi from being fetched twice on every login, once here
     * and another time by globals.js
     * 
     * The reason globals.js fetches the serverApi is for robustness, should the user clear
     * localStorage whilst logged in without globals.js fetching the serverApi again nothing else
     * on the site would work.
     */
    setTimeout(fitnessTrackerLoginPage.setupLoginPage, 500);

    $('#loginForm').submit(function () {
        fitnessTrackerLoginPage.loginRequestAjax();
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


var fitnessTrackerLoginPage = function () {

    function setupLoginPage()
    {
        if (fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(fitnessTrackerGlobals.serverApi))
        {
            fitnessTrackerGlobals.ajaxFunctions.getServerAPI(function () {
                setupForms();
            });
        } else
        {
            setupForms();
        }

        function setupForms()
        {
            //document.getElementById("loginForm").action = serverApi.requests.LOGIN_REQUEST;
            document.getElementById("createAccountForm").action = fitnessTrackerGlobals.serverApi.requests.CREATE_ACCOUNT_PAGE_REQUEST;
            document.getElementById("forgotPasswordForm").action = fitnessTrackerGlobals.serverApi.requests.FORGOT_PASSWORD_PAGE_REQUEST;

            //autologin for development
            document.getElementById("email").value = "test@test.com";
            document.getElementById("password").value = "testtest";
        }
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
            url: fitnessTrackerGlobals.serverApi.requests.LOGIN_REQUEST,
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

                    window.location = fitnessTrackerGlobals.serverApi.requests.MACRO_LOG_PAGE_REQUEST;
                } else
                {
                    document.getElementById("feedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode] + " please try again</div>";
                }
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
            }
        });
    }
    return{
        loginRequestAjax: loginRequestAjax,
        setupLoginPage: setupLoginPage
    };
}();