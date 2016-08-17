/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Makes a search request to the server, the server will search its database of foods
 * for foods matching or similar to what the user typed in and will return that list
 * of foods.
 * @param {type} searchInput
 * @returns {undefined}
 */
function searchForFood(searchInput)
{
    var searchInputJSON = {};

    //check for invalid search parameters, empty strings, null values etc
    if (fitnessTrackerGlobals.commonFunctions.isUndefinedOrNull(searchInput) || searchInput === "")
    {
        console.log("invalid search parameter, aborting search");
        fitnessTrackerGlobals.setGlobalValues.setSearchResultsArray([]) //empty this otherwise the previous successful search results will show when updateFoodLogPage() is called
        //localStorage.setItem("fitnessTrackerGlobals.globalValues",fitnessTrackerGlobals.globalValues);
        //var innerHTML = "<li class='list-group-item searchresult'> Invalid search parameter please retry.</li>";
        //document.getElementById("searchResultList").innerHTML = innerHTML;
    } else
    {
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
                    fitnessTrackerGlobals.setGlobalValues.setSearchResultsArray(returnObject.data)
                    updateFoodLogPage();
                } else
                {
                    console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
                }

            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
            }
        });
    }
}

function addCustomFood(foodUuid)
{
    var searchResultArray = $.grep(fitnessTrackerGlobals.globalValues.userValues.customFoodsArray, function (object) {
        return object.identifierFoodAttributes.foodUuid === foodUuid;
    });

    if ($.isEmptyObject(searchResultArray))
    {
        console.log("addCustomFood() custom food not found")
    } else
    {
        var customFood = searchResultArray[0];
        addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), customFood);
    }

   // searchResult[0];
    //search customFoodListJSON for the food the user wants to add to their food log
//    for (var currentFood in customFoodsArrayRef)
//    {
//        if (customFoodsArrayRef[currentFood].foodUuid === foodUuid)
//        {
//            outputJSON = customFoodsArrayRef[currentFood];
//        }
//    }
    //addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), customFood);
}

/**
 * This method prepares a JSON object to be added by the addEatenFood() method.
 * This method directly deals with foods to be added from a database query i.e. the user
 * searched for "milk" then clicked one of the results, this method is what is called.
 * 
 * @param {type} foodUuid
 * @returns {undefined}
 */
function addEatenFoodFromSearchResult(foodUuid)
{
//    var outputJSON = {};
//    var searchResultArrayRef = fitnessTrackerGlobals.globalValues.userValues.searchResultsArray;
//    //search customFoodListJSON for the food the user wants to add to their food log
//    for (var currentFood in searchResultArrayRef)
//    {
//        if (searchResultArrayRef[currentFood].id_searchablefood === id_searchablefood)
//        {
//            var matchingFood = searchResultArrayRef[currentFood];
//
//            for (var currentProperty in matchingFood)
//            {
//                outputJSON[currentProperty] = matchingFood[currentProperty];
//            }
//        }
//    }
//
//    outputJSON = calculateMacrosFromWeight(id_searchablefood, outputJSON);
//    addEatenFood(outputJSON);
    
    
    
     var searchResultArray = $.grep(fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray, function (object) {
        return object.identifierFoodAttributes.foodUuid === foodUuid;
    });

    if ($.isEmptyObject(searchResultArray))
    {
        console.log("addEatenFoodFromSearchResult() search result food not found")
    } else
    {
        var searchResultFood = searchResultArray[0];
        addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), searchResultFood);
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
    var formattedEatenFood = fitnessTrackerGlobals.commonFunctions.formatFoodObject(eatenFood);
    
    addEatenFood(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), formattedEatenFood);
}

/**
 * A method to add a food that has been eaten to the users eatenfoodtable in the
 * database
 * @param Date date - the date and time the food was eaten
 * @param {type} foodJson
 * @returns {undefined}
 */
function addEatenFood(date, foodJson)
{
    //date to add the food, user may wish to update the previous days log etc
    foodJson.identifierFoodAttributes.unixTime = fitnessTrackerGlobals.commonFunctions.getUnixDate(date);
    console.log("addEatenFood(): attempting to add food that was eaten");
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
                console.log("addEatenFood() suceeded");
                fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), function () {
                    updateFoodLogPage();
                });

                //clear form
                document.getElementById("addEatenFoodForm").reset();
            } else
            {
                console.log("Error:" + fitnessTrackerGlobals.serverApi.errorCodes[returnObject.errorCode]);
            }
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
 * @param {type} id_eatenfood
 * @returns {undefined}
 */
function removeEatenFood(foodUuid)
{
    console.log("removeEatenFood() removing food" + foodUuid);
    var eatenfoodJSON = {};
    eatenfoodJSON.foodUuid = foodUuid;
    $.ajax({
        url: fitnessTrackerGlobals.serverApi.requests.REMOVE_EATEN_FOOD,
        type: "POST",
        data: JSON.stringify(eatenfoodJSON),
        contentType: "application/json",
        dataType: "json",
        success: function (returnObject)
        {
            if (returnObject.success === true)
            {
                console.log("eaten food removal suceeded");
                fitnessTrackerGlobals.ajaxFunctions.getEatenFoodList(fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate(), function () {
                    updateFoodLogPage();
                });
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


/**
 * This method gets the date that the user has selected with the datepicker and returns it in Unix time
 * format.
 * @returns {Number}
 */
//function getSelectedUNIXdate()
//{
//    var currentDate = new Date();
//    var selectedDate = $('#foodDatepicker').datepicker('getUTCDate');
//
//
//    var currentDateUtcUnix = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(),
//            currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
//    var selectedDateUnix = Math.floor(selectedDate.getTime() / 1000); // we need /1000 to get seconds, otherwise milliseconds is returned
//    var startOfCurrentDateUnix = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//
//    //if a date in the future or past i.e. tomorrow or yesterday is selected then
//    //that will be used as the foods timestamp, otherwise todays date and time will
//    //be used. This allows the user to modify a previous days food log or plan ahead
//    //and modify a future dates food log.
//    if (selectedDateUnix > currentDateUtcUnix || selectedDateUnix < startOfCurrentDateUnix)
//    {
//        return selectedDateUnix;
//    } else
//    {
//        return currentDateUtcUnix;
//    }
//}
