$(document).ready(function () {
    fitnessTrackerGlobals.commonFunctions.setupNavbar();
    customFoodsPage.eventFunctions.setupCustomFoodEvents();
    customFoodsPage.eventFunctions.setupMiscEvents();
    document.getElementById("customFoodFeedback").innerHTML = customFoodsPage.userFeedbackHtml.defaultInfo;
});

var customFoodsPage = function () {

    var eventFunctions = function () {

        function setupCustomFoodEvents()
        {
            //remove food listener
            $("#customFoodsListEditable").on("click", ".removeCustomFoodButton", function () {
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                var foodToDelete = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.userValues.customFoodsArray, foodUuid)
                ajaxFunctions.deleteCustomFood(foodToDelete);
            });

            //edit food listener
            $("#customFoodsListEditable").on("click", ".editCustomFoodButton", function () {
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                customFoodsVue.vueFunctions.createEditCustomFoodForm(foodUuid);
            });

            $(document).on("submit", "#editCustomFoodForm", function (e) {
                e.preventDefault();
                var formData = $("#editCustomFoodForm").serializeArray();
                var newCustomFoodValues = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                newCustomFoodValues.foodUuid = foodUuid;
                ajaxFunctions.saveEditedCustomFood(newCustomFoodValues);
                //$('#editCustomFoodModal').modal('hide');
                //return false;
            });

            $(document).on("submit", "#createCustomFoodForm", function (event) {
                event.preventDefault();
                var formData = $("#createCustomFoodForm").serializeArray();
                var newCustomFood = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
                ajaxFunctions.createCustomFood(newCustomFood);
            });

//            $(document).on("focus", "#addFoodForm", function () {
//                document.getElementById("addCustomFoodFeedback").innerHTML = "";
//            });
        }

        function setupMiscEvents()
        {
            $(document).on("click", ".foodInfoButton", function (e) {
                e.stopPropagation();
                var clickedElement = this;
                var foodUuid = clickedElement.dataset.foodUuid;
                globalVue.vueRelatedFunctions.createEatenFoodInfo(foodUuid);
            });

            //auto selects form input text when clicked
            $(document).on('click', 'input', function () {
                this.select();
            });
        }

        //eventFunctions
        return{
            setupCustomFoodEvents: setupCustomFoodEvents,
            setupMiscEvents: setupMiscEvents
        };
    }();

    var ajaxFunctions = function () {

        function deleteCustomFood(foodToDelete)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.DELETE_CUSTOM_FOOD,
                type: "POST",
                data: JSON.stringify(foodToDelete),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        fitnessTrackerGlobals.ajaxFunctions.getCustomFoodList();
                        document.getElementById("customFoodFeedback").innerHTML = userFeedbackHtml.deleteCustomFoodSuccess(returnObject.data.descriptiveFoodProperties.foodname);
                        setTimeout(function () {
                            document.getElementById("customFoodFeedback").innerHTML = customFoodsPage.userFeedbackHtml.defaultInfo;
                        }, 10000);
                    } else
                    {
                        console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                        document.getElementById("createCustomFoodFeedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        function createCustomFood(newCustomFood)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.CREATE_CUSTOM_FOOD,
                type: "POST",
                data: JSON.stringify(newCustomFood),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        fitnessTrackerGlobals.ajaxFunctions.getCustomFoodList();
                        document.getElementById("createCustomFoodForm").reset();
                        document.getElementById("createCustomFoodFeedback").innerHTML = userFeedbackHtml.createCustomFoodSuccess(returnObject.data.foodname);
                        setTimeout(function () {
                            document.getElementById("createCustomFoodFeedback").innerHTML = "";
                        }, 10000);

                    } else
                    {
                        console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                        document.getElementById("createCustomFoodFeedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        function saveEditedCustomFood(newCustomFoodValues)
        {
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.EDIT_CUSTOM_FOOD,
                type: "POST",
                data: JSON.stringify(newCustomFoodValues),
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        fitnessTrackerGlobals.ajaxFunctions.getCustomFoodList();
                        document.getElementById("editCustomFoodFeedback").innerHTML = userFeedbackHtml.editCustomFoodSuccess(returnObject.data.foodname);
                        setTimeout(function () {
                            document.getElementById("editCustomFoodFeedback").innerHTML = "";
                        }, 10000);
                    } else
                    {
                        console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                        document.getElementById("createCustomFoodFeedback").innerHTML = userFeedbackHtml.error(returnObject.errorCode);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        //customFoodAjax
        return{
            createCustomFood: createCustomFood,
            deleteCustomFood: deleteCustomFood,
            saveEditedCustomFood: saveEditedCustomFood
        };
    }();

    var customFoodsFunctions = function () {
        function loadCustomFoodValuesOntoForm(foodUuid)
        {
            var customFood = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.userValues.customFoodsArray, foodUuid);
            var selectedFoodProperties = fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties;

            //clear form
            //document.getElementById("editCustomFoodForm").reset();

            for (var property in selectedFoodProperties)
            {
                innerLoop:for (var macroSubcategory in customFood)
                {
                    if (selectedFoodProperties[property] && customFood[macroSubcategory].hasOwnProperty(property))
                    {
                        document.getElementById(property + "input").value = customFood[macroSubcategory][property];
                        break innerLoop;
                    }
                }
            }
        }


        //customFoodsFunctions
        return{
            loadCustomFoodValuesOntoForm: loadCustomFoodValuesOntoForm
        };
    }();

    var userFeedbackHtml = function () {

        var error = function (errorCode) {
            return  "<div class='alert alert-danger' role='alert'>" + fitnessTrackerGlobals.serverApi.errorCodes[errorCode] + ", no action taken</div>";
        };

        var createCustomFoodSuccess = function (customFoodName) {
            return "<div class='alert alert-success' role='alert'>Custom food " + customFoodName + " successfully created</div>";
        };

        var deleteCustomFoodSuccess = function (customFoodName) {
            return "<div class='alert alert-success' role='alert'>Custom food " + customFoodName + " successfully deleted</div>";
        };

        var editCustomFoodSuccess = function (customFoodName) {
            return "<div class='alert alert-success' role='alert'>Custom food " + customFoodName + " successfully edited</div>";
        };
        var defaultInfo = "<div class='alert alert-info' role='alert'><span class='glyphicon glyphicon-info-sign'></span> Create/Edit/Delete your custom foods here</div>";

        //userFeedbackHtml
        return{
            error: error,
            createCustomFoodSuccess: createCustomFoodSuccess,
            deleteCustomFoodSuccess: deleteCustomFoodSuccess,
            editCustomFoodSuccess: editCustomFoodSuccess,
            defaultInfo: defaultInfo

        };
    }();

    //customFoodsPage
    return{
        eventFunctions: eventFunctions,
        ajaxFunctions: ajaxFunctions,
        customFoodsFunctions: customFoodsFunctions,
        userFeedbackHtml: userFeedbackHtml
    };
}();