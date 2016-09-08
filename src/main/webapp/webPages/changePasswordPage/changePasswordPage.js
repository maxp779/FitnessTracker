$(document).ready(function () {
    document.getElementById("loginPageForm").action = fitnessTrackerGlobals.serverApi.requests.LOGIN_PAGE_REQUEST;
    document.getElementById("forgotPasswordForm").action = fitnessTrackerGlobals.serverApi.requests.FORGOT_PASSWORD_PAGE_REQUEST;

    changePasswordPage.eventFunctions.setupEvents();
    changePasswordPage.eventFunctions.setupPasswordStrengthTester();
    
    //we get the token attached to this change password request from the URL
    //then we request from the server the email attached to the token
    changePasswordPage.changePasswordPageFunctions.getQueryStringParameters(function ()
    {
        changePasswordPage.ajaxFunctions.getEmail();
    });
});

var changePasswordPage = function () {

    var changePasswordPageVariables = function () {

        var email;
        var urlQueryStringParams;

        return{
            email: email,
            urlQueryStringParams: urlQueryStringParams
        };
    }();

    var changePasswordPageFunctions = function () {

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

            changePasswordPageVariables.urlQueryStringParams = {};
            while (match = search.exec(query))
                changePasswordPageVariables.urlQueryStringParams[decode(match[1])] = decode(match[2]);

            if (callback)
            {
                callback();
            }
        }

        return{
            getQueryStringParameters: getQueryStringParameters
        };
    }();


    var eventFunctions = function () {

        function setupEvents() {

            $('#changePasswordForm').submit(function (event) {
                event.preventDefault();
                if (fitnessTrackerGlobals.globalValues.miscValues.passwordValid)
                {
                    var formData = $("#changePasswordForm").serializeArray();
                    var formDataObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                    formDataObject.identifierToken = changePasswordPageVariables.urlQueryStringParams.identifierToken;
                    formDataObject.email = changePasswordPageVariables.email;
                    ajaxFunctions.changePasswordRequest(formDataObject);
                }
            });

            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });
        }

        function setupPasswordStrengthTester() {
            passwordStrengthTester("password", "confirmPassword", "passwordStrength");
        }

        return{
            setupEvents: setupEvents,
            setupPasswordStrengthTester: setupPasswordStrengthTester
        };
    }();

    var ajaxFunctions = function () {

        function getEmail()
        {
            var inputObject = {};
            inputObject.identifierToken = changePasswordPageVariables.urlQueryStringParams.identifierToken;

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
                        changePasswordPageVariables.email = returnObject.data.email;
                    } else
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode, "this passsword change request may have expired, please make another one");
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        function changePasswordRequest(formDataObject)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.CHANGE_PASSWORD_REQUEST,
                type: "POST",
                data: JSON.stringify(formDataObject),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    document.getElementById("passwordStrength").innerHTML = "";
                    if (returnObject.success === true)
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.passwordChangedSuccessfully(returnObject.data.email);
                    } else
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode, " please make a new password change request");
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }
        
        //ajaxFunctions
        return{
            getEmail: getEmail,
            changePasswordRequest:changePasswordRequest
        };
    }();

    var userFeedbackHtml = function () {
        
        var error = function(errorCode, info = "")
        {
            return "<div class=\"alert alert-danger\" role=\"alert\">" + fitnessTrackerGlobals.serverApi.errorCodes[errorCode] + " " + info + "</div>";
        };
        
        var passwordChangedSuccessfully = function(email)
        {
            return "<div class=\"alert alert-success\" role=\"alert\">Password changed successfully for " + email + "</div>";
        };
        
        //userFeedbackHtml
        return{
            error:error,
            passwordChangedSuccessfully:passwordChangedSuccessfully
        };
    }();

    //changePasswordPage
    return{
        eventFunctions: eventFunctions,
        ajaxFunctions: ajaxFunctions,
        changePasswordPageFunctions: changePasswordPageFunctions,
        changePasswordPageVariables: changePasswordPageVariables
    };
}();