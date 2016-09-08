var foodLogAjax = function () {

    /**
     * Makes a search request to the server, the server will search its database of foods
     * for foods matching or similar to what the user typed in and will return that list
     * of foods.
     * @param {type} searchInput
     * @returns {undefined}
     */
    function searchForFood(searchInput)
    {
        if (privateHelpers.validateSearchInput(searchInput))
        {
            var searchInputJSON = {};
            searchInputJSON.searchInput = searchInput.toLowerCase(); //database is lower case so user input must be converted to lower case
            console.log("Ajax request: searching for food: " + JSON.stringify(searchInputJSON));
            $.ajax({
                url: fitnessTrackerGlobals.serverApi.requests.SEARCH_FOR_FOOD,
                type: "GET",
                data: searchInputJSON,
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        var numberOfResults = returnObject.data.length;
                        if (numberOfResults === 0)
                        {
                            document.getElementById("searchFeedback").innerHTML = foodLogPresentation.userFeedbackHtml.noResultsFound;
                        } else
                        {
                            document.getElementById("searchFeedback").innerHTML = foodLogPresentation.userFeedbackHtml.resultsFound(numberOfResults);
                        }
                        fitnessTrackerGlobals.setGlobalValues.setSearchResultsArray(returnObject.data);
                    } else
                    {
                        document.getElementById("searchFeedback").innerHTML = foodLogPresentation.userFeedbackHtml.searchFailed;
                        console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                    }
                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        } else
        {
            document.getElementById("searchFeedback").innerHTML = foodLogPresentation.userFeedbackHtml.invalidSearchParameter;
            fitnessTrackerGlobals.setGlobalValues.setSearchResultsArray([]);
        }

    }

    function addCustomFood(foodUuid, userFeedbackElement)
    {
        var customFood = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.userValues.customFoodsArray, foodUuid);

        if (fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(customFood))
        {
            console.log("addCustomFood() food not found, no action taken");
        } else
        {
            addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), customFood, userFeedbackElement);
        }
    }

    /**
     * This method prepares a JSON object to be added by the addEatenFood() method.
     * This method directly deals with foods to be added from a database query i.e. the user
     * searched for "milk" then clicked one of the results, this method is what is called.
     * 
     * @param {type} foodUuid
     * @returns {undefined}
     */
    function addEatenFoodFromSearchResult(foodUuid, userFeedbackElement)
    {
        var searchResultFood = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray, foodUuid);

        if (fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(searchResultFood))
        {
            console.log("addEatenFoodFromSearchResult() food not found, no action taken");
        } else
        {
            addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), searchResultFood, userFeedbackElement);
        }
    }

    /**
     * If the user wishes to add a food manually by typing in data this is the method
     * that directly deals with that.
     * @returns {undefined}
     */
    function addEatenFoodManually()
    {
        var formData = $("#addEatenFoodForm").serializeArray();
        var eatenFood = fitnessTrackerGlobals.commonFunctions.convertFormArrayToJSON(formData);
        var formattedEatenFood = fitnessTrackerGlobals.commonFunctions.organizeObject(eatenFood);

        addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), formattedEatenFood);
    }

    /**
     * A method to add a food that has been eaten to the users eatenfoodtable in the
     * database
     * @param date - the date and time the food was eaten
     * @param {type} foodJson the object representing the food that was eaten
     * @param {type} userFeedbackElement the HTML element that feedback will be given on
     * @returns {undefined}
     */
    function addEatenFood(date, foodJson, userFeedbackElement)
    {
        //date to add the food, user may wish to update the previous days log etc
        foodJson.identifierFoodProperties.unixTime = fitnessTrackerGlobals.commonFunctions.getUnixDate(date);
        console.log(foodJson);

        $.ajax({
            url: fitnessTrackerGlobals.serverApi.requests.ADD_EATEN_FOOD,
            type: "POST",
            data: JSON.stringify(foodJson),
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate());
                    userFeedbackElement.innerHTML = foodLogPresentation.userFeedbackHtml.foodAddSuccess(foodJson.descriptiveFoodProperties.foodname);
                } else
                {
                    userFeedbackElement.innerHTML = foodLogPresentation.userFeedbackHtml.foodAddFailed(foodJson.descriptiveFoodProperties.foodname);
                    console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                }
                setTimeout(function () {
                        userFeedbackElement.innerHTML = "";
                    }, 5000);
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
            }
        });
    }

    /**
     * A method to remove a food that has already been added to the users eatenfoodtable in the
     * database
     * @param {type} foodUuid
     * @returns {undefined}
     */
    function removeEatenFood(foodUuid)
    {
        console.log("removeEatenFood() removing food" + foodUuid);
        var foodUuidToRemoveJson = {};
        foodUuidToRemoveJson.foodUuid = foodUuid;
        $.ajax({
            url: fitnessTrackerGlobals.serverApi.requests.REMOVE_EATEN_FOOD,
            type: "POST",
            data: JSON.stringify(foodUuidToRemoveJson),
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("eaten food removal suceeded");
                    fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate());
                } else
                {
                    console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                }
            },
            error: function (xhr, status, error)
            {
                // check status && error
                console.log("Ajax request failed:" + error.toString());
            }
        });
    }

    var privateHelpers = function () {

        function validateSearchInput(searchInput)
        {
            if (fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(searchInput) || searchInput === "")
            {
                return false;
            } else
            {
                return true;
            }
        }

        //privateHelpers functions
        return{
            validateSearchInput: validateSearchInput
        };
    }();


    //foodLogAjax functions
    return{
        addCustomFood: addCustomFood,
        addEatenFoodFromSearchResult: addEatenFoodFromSearchResult,
        addEatenFoodManually: addEatenFoodManually,
        removeEatenFood: removeEatenFood,
        searchForFood: searchForFood
    };

}();
