$(document).ready(function () {
    fitnessTrackerGlobals.commonFunctions.setupNavbar();
    settingsPage.setupEvents();
    settingsPage.setupFormActions();
});

$('#selectedPropertyTabs a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

var settingsPage = function () {

    var userFeedbackHtml = function () {

        var emailChangeSuccess = function (oldEmail, newEmail) {
            return "<div class=\"alert alert-success\" role=\"alert\">Email changed successfully from "
                    + oldEmail
                    + " to "
                    + newEmail
                    + "</div>";
        };

        var error = function (errorCode) {
            return  "<div class=\"alert alert-danger\" role=\"alert\">" + fitnessTrackerGlobals.serverApi.errorCodes[errorCode] + ", no action taken</div>";
        };
        var passwordUpdatedSuccessfully = function (email) {
            return "<div class=\"alert alert-success\" role=\"alert\">Password changed successfully for " + email + "</div>";
        };
        var propertiesUpdatedSuccessfully = "<div class=\"alert alert-success\" role=\"alert\">Properties updated successfully</div>";

        return{
            emailChangeSuccess: emailChangeSuccess,
            error: error,
            propertiesUpdatedSuccessfully: propertiesUpdatedSuccessfully,
            passwordUpdatedSuccessfully: passwordUpdatedSuccessfully
        };
    }();


    function setupFormActions()
    {
        document.getElementById("deleteAccountForm").action = fitnessTrackerGlobals.serverApi.requests.DELETE_ACCOUNT_REQUEST;
        privateHelpers.showSelectedFoodProperties();
    }

    function setupEvents()
    {
        //this adds an event from passwordStrength.js which gives user feedback and controls fitnessTrackerGlobals.globalValues.miscValues.passwordValid
        passwordStrengthTester("newPassword", "confirmNewPassword", "passwordStrength");
        //this adds an event from emailValid.js which gives user feedback and controls fitnessTrackerGlobals.globalValues.emailValid
        emailMatchValidator("newEmail", "confirmNewEmail", "emailFeedback");

        $('#editSelectedPropertiesForm').submit(function (event) {
            event.preventDefault();

            var selectedPropertiesFormData = $('#editSelectedPropertiesForm').serializeArray();
            var newSelectedProperties = privateHelpers.createUpdatedSelectedPropertiesObject(selectedPropertiesFormData);
            ajaxRequests.updateSelectedFoodProperties(newSelectedProperties);
        });

        $('#changePasswordForm').submit(function (event) {
            event.preventDefault();
            if (fitnessTrackerGlobals.globalValues.miscValues.passwordValid)
            {
                var formData = $("#changePasswordForm").serializeArray();
                var newPasswordObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                ajaxRequests.changePasswordRequest(newPasswordObject);
            } else
            {
                console.log("password does not meet strength requirements");
            }
        });

        $('#changeEmailForm').submit(function (event) {
            event.preventDefault();
            if (fitnessTrackerGlobals.globalValues.miscValues.emailValid)
            {
                var formData = $("#changeEmailForm").serializeArray();
                var newEmailObject = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                ajaxRequests.changeEmailRequest(newEmailObject);
            } else
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

        $("#editSelectedPropertiesForm :input").change(function () {
            document.getElementById("propertyFeedback").innerHTML = "";
        });

        //auto selects form input text when clicked
        $(document).on('click', 'input', function () {
            this.select();
        });
    }

    var ajaxRequests = function ()
    {
        function changeEmailRequest(newEmailObject)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.CHANGE_EMAIL_REQUEST,
                type: "POST",
                data: JSON.stringify(newEmailObject),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    //{"success":"true", "oldEmail":"123@123.com", "newEmail":"bawbags@baws.com", "errorCode":"13"}

                    if (returnObject.success === true)
                    {
                        console.log("email changed");
                        document.getElementById("changeEmailForm").reset();
                        document.getElementById("emailFeedback").innerHTML = userFeedbackHtml.emailChangeSuccess(returnObject.data.oldEmail, returnObject.data.newEmail);
                    } else
                    {
                        document.getElementById("emailFeedback").innerHTML = userFeedbackHtml.error(fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);

                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        function updateSelectedFoodProperties(newSelectedFoodProperties, callback)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.MODIFY_SELECTED_FOOD_PROPERTIES,
                type: "POST",
                data: JSON.stringify(newSelectedFoodProperties),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        fitnessTrackerGlobals.setGlobalValues.setSelectedFoodProperties(returnObject.data);
                        fitnessTrackerGlobals.commonFunctions.reRenderAllWatchedArrays();
                        document.getElementById("propertyFeedback").innerHTML = userFeedbackHtml.propertiesUpdatedSuccessfully;
                    } else
                    {
                        document.getElementById("propertyFeedback").innerHTML = userFeedbackHtml.error(fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                    }
                    if (callback)
                    {
                        callback();
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        function changePasswordRequest(newPasswordObject)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.CHANGE_PASSWORD_REQUEST,
                type: "POST",
                data: JSON.stringify(newPasswordObject),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        console.log("password changed");
                        document.getElementById("passwordStrength").innerHTML = "";
                        document.getElementById("changePasswordForm").reset();
                        document.getElementById("passwordFeedback").innerHTML = userFeedbackHtml.passwordUpdatedSuccesfully(returnObject.data.email);
                    } else
                    {
                        document.getElementById("passwordStrength").innerHTML = "";
                        document.getElementById("passwordFeedback").innerHTML = userFeedbackHtml.error(fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }
        //ajaxRequest functions
        return{
            changeEmailRequest: changeEmailRequest,
            updateSelectedFoodProperties: updateSelectedFoodProperties,
            changePasswordRequest: changePasswordRequest
        };
    }();

    var privateHelpers = function () {

        //this function is a candidate for vue.js component replacement, replace the entire form
        function showSelectedFoodProperties()
        {
            var selectedFoodPropertiesRef = fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties;
            //clear form
            //document.getElementById("editSelectedPropertiesForm").reset();
            for (var currentProperty in selectedFoodPropertiesRef)
            {
                var currentElementName = currentProperty.toString();
                currentElementName = currentElementName + "checkbox";
                var currentElement = document.getElementById(currentElementName);
                if (currentElement !== null)
                {
                    if (selectedFoodPropertiesRef[currentProperty] === true)
                    {
                        currentElement.checked = true;
                    }
                }
            }
        }

        function createUpdatedSelectedPropertiesObject(formDataArray)
        {
            var currentSelectedPropertiesCopy = jQuery.extend(true, {}, fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties);

            //set all to false
            for (var aProperty in currentSelectedPropertiesCopy)
            {
                currentSelectedPropertiesCopy[aProperty] = false;
            }

            //set selected properties to true
            for (var count = 0; count < formDataArray.length; count++)
            {
                var currentObject = formDataArray[count];
                var selectedProperty = currentObject["value"];
                currentSelectedPropertiesCopy[selectedProperty] = true;
            }

            return currentSelectedPropertiesCopy;
        }

        //privateHelpers functions
        return{
            showSelectedFoodProperties: showSelectedFoodProperties,
            createUpdatedSelectedPropertiesObject: createUpdatedSelectedPropertiesObject
        };
    }();

    //settingsPage functions
    return{
        setupEvents: setupEvents,
        setupFormActions: setupFormActions
    };

}();

