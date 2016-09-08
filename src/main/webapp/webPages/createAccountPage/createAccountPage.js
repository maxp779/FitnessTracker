$(document).ready(function () {
    createAccountPage.miscFunctions.setupFormActions();
    createAccountPage.eventFunctions.setupEvents();
    createAccountPage.eventFunctions.setupPasswordStrengthTester();
});

var createAccountPage = function () {

    var miscFunctions = function () {

        function setupFormActions() {
            document.getElementById("loginPageForm").action = fitnessTrackerGlobals.serverApi.requests.LOGIN_PAGE_REQUEST;
        }
        //miscFunctions
        return{
            setupFormActions: setupFormActions
        };
    }();

    var eventFunctions = function () {

        function setupEvents() {
            $('#createAccountForm').submit(function (e) {
                e.preventDefault();

                if (fitnessTrackerGlobals.globalValues.miscValues.passwordValid)
                {
                    var formData = $("#createAccountForm").serializeArray();
                    var formDataObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                    ajaxFunctions.createAccountRequest(formDataObject);
                }
            });

            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });
        }

        function setupPasswordStrengthTester()
        {
            passwordStrengthTester("password", "confirmPassword", "passwordStrength");
        }
        return{
            setupEvents: setupEvents,
            setupPasswordStrengthTester: setupPasswordStrengthTester
        };
    }();

    var userFeedbackHtml = function () {

        var error = function(errorCode, info = "")
        {
            return "<div class=\"alert alert-danger\" role=\"alert\">" + fitnessTrackerGlobals.serverApi.errorCodes[errorCode] + " " + info + "</div>";
        }
        
        var accountCreationSuccess = function(email)
        {
            return "<div class=\"alert alert-success\" role=\"alert\">Account created successfully for " + email + "</div>";
        }    

        //userFeedbackHtml
        return{
            error:error,
            accountCreationSuccess:accountCreationSuccess
        };
    }();

    var ajaxFunctions = function () {
        function createAccountRequest(formDataObject)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.CREATE_ACCOUNT_REQUEST,
                type: "POST",
                data: JSON.stringify(formDataObject),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    document.getElementById("passwordStrength").innerHTML = "";

                    if (returnObject.success === true)
                    {
                        document.getElementById("feedback").innerHTML = userFeedbackHtml.accountCreationSuccess(returnObject.data.email);
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

        //ajaxFunctions
        return{
            createAccountRequest: createAccountRequest
        };
    }();

    //createAccountPage
    return{
        ajaxFunctions: ajaxFunctions,
        eventFunctions: eventFunctions,
        miscFunctions: miscFunctions
    };
}();