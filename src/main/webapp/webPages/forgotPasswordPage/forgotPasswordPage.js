$(document).ready(function () {
    document.getElementById("loginPageForm").action = fitnessTrackerGlobals.serverApi.requests.LOGIN_PAGE_REQUEST;
    forgotPasswordPage.eventFunctions.setupForgotPasswordEvents();
});

var forgotPasswordPage = function () {
    
    var eventFunctions = function () {

        function setupForgotPasswordEvents()
        {
            $('#forgottenPasswordForm').submit(function (e) {
                e.preventDefault();
                var formData = $("#forgottenPasswordForm").serializeArray();
                var formDataObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                ajaxFunctions.forgottonPasswordRequest(formDataObject);
            });

            $('#email').on('keyup', function () {
                document.getElementById("feedback").innerHTML = "";
            });

            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });
        }
        
        return{
            setupForgotPasswordEvents:setupForgotPasswordEvents
        };

    }();

    var ajaxFunctions = function () {

        function forgottonPasswordRequest(formDataObject)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.FORGOT_PASSWORD_EMAIL_REQUEST,
                type: "POST",
                data: JSON.stringify(formDataObject),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.emailSentSuccessfully(returnObject.data.email);
                    } else
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }
        return{
            forgottonPasswordRequest: forgottonPasswordRequest
        };
    }();



    var userFeedbackHtml = function () {

        var emailSentSuccessfully = function (email)
        {
            return "<div class=\"alert alert-success\" role=\"alert\">Email sent to " + email + " with details on how to reset your password.</div>";
        };

        var error = function (errorCode)
        {
            return "<div class=\"alert alert-danger\" role=\"alert\">Error: " + fitnessTrackerGlobals.serverApi.errorCodes[errorCode] + "</div>";
        };

        //userFeedbackHtml
        return{
            emailSentSuccessfully: emailSentSuccessfully,
            error: error
        };
    }();

    //forgotPasswordPage
    return{
        ajaxFunctions: ajaxFunctions,
        eventFunctions:eventFunctions
    };
}();
