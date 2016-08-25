


var foodLogPresentation = function () {

    function incrementDate()
    {
        console.log("incrementDate()");
        var currentlyViewedDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
        currentlyViewedDate.setDate(currentlyViewedDate.getDate() + 1);
        fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
    }

    function decrementDate()
    {
        console.log("decrementDate()");
        var currentlyViewedDate = fitnessTrackerGlobals.commonFunctions.getCurrentlyViewedDate();
        currentlyViewedDate.setDate(currentlyViewedDate.getDate() - 1);
        fitnessTrackerGlobals.commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
        $('#foodDatePicker').datepicker('setDate', currentlyViewedDate);
    }

    /**
     * Here the macros for foods are updated based on their weight. If the user searches for
     * "milk" and changes the default weight of 100 to 500 then this method is called and will
     * update the page reflecting that change. Instead of say 5g of protein it would show 25g etc.
     * 
     * It uses a baseline value for the macros to calculate based on their weight. searchResultsArray is used
     * for the baseline value and is therefore not modified at all. tempSearchResultsArray is modified to reflect the
     * new values. The reason for this is if we were to use a single array and the user sets the weight to 0, all macros
     * would be set to 0 and there would be no way to get their original values back if the weight changed to 100 again. So 
     * we need a baseline.
     * 
     * @param {type} foodUuid the uuid of the food to modify
     * @param {type} newWeight the weight that was entered
     */
    function updateSearchResultMacros(foodUuid, newWeight)
    {
        var validNewWeight = privateHelpers.ensureValidWeight(newWeight);

        //var foodObjectIndex = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray, foodUuid);
        var foodObjectToModify = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray, foodUuid);

        //var baselineFoodObjectIndex = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.userValues.searchResultsArray, foodUuid);
        var baselineFoodObject = fitnessTrackerGlobals.commonFunctions.findFoodObjectByUuid(fitnessTrackerGlobals.globalValues.userValues.searchResultsArray, foodUuid);
        var multiplier = (validNewWeight / baselineFoodObject.primaryFoodProperties.weight);
        
        //for each food subcategory
        for (var subcategory in baselineFoodObject)
        {
            var isNonOperableSubcategory = (subcategory === "descriptiveFoodProperties" || subcategory === "identifierFoodProperties");

            if (!isNonOperableSubcategory)
            {
                //for each property in the subcategory
                for (var aProperty in baselineFoodObject[subcategory])
                {
                    var baselineValue = baselineFoodObject[subcategory][aProperty];
                    if (jQuery.isNumeric(baselineValue))
                    {
                        if (fitnessTrackerGlobals.serverApi.wholeIntegerProperties.indexOf(aProperty) !== -1) //if whole integer
                        {
                            baselineValue = baselineValue * multiplier;
                            foodObjectToModify[subcategory][aProperty] = baselineValue.toFixed(0);
                        } else //if float
                        {
                            baselineValue = baselineValue * multiplier;
                            foodObjectToModify[subcategory][aProperty] = baselineValue.toFixed(2);
                        }
                    }
                }
            }
        }


//
//        for (var aProperty in baselineFoodObject.primaryFoodProperties)
//        {
//            var baselineValue = baselineFoodObject.primaryFoodProperties[aProperty];
//
//            if (fitnessTrackerGlobals.globalValues.miscValues.wholeIntegerProperties.indexOf(aProperty) === -1) //if float
//            {
//                baselineValue = baselineValue * multiplier;
//                foodObjectToModify.primaryFoodProperties[aProperty] = baselineValue.toFixed(1);
//            } else //if whole integer
//            {
//                baselineValue = baselineValue * multiplier;
//                foodObjectToModify.primaryFoodProperties[aProperty] = baselineValue.toFixed(0);
//            }
//        }
//        for (var aProperty in baselineFoodObject.secondaryFoodProperties)
//        {
//            var baselineValue = baselineFoodObject.secondaryFoodProperties[aProperty]
//            if (fitnessTrackerGlobals.globalValues.miscValues.wholeIntegerProperties.indexOf(aProperty) === -1)
//            {
//                baselineValue = baselineValue * multiplier;
//                foodObjectToModify.secondaryFoodProperties[aProperty] = baselineValue.toFixed(1);
//            } else
//            {
//                baselineValue = baselineValue * multiplier;
//                foodObjectToModify.secondaryFoodProperties[aProperty] = baselineValue.toFixed(0);
//            }
//        }

        privateHelpers.updateSearchResultsArrayFriendly(foodObjectToModify);
    }

    var privateHelpers = function () {

        function updateSearchResultsArrayFriendly(foodObject)
        {
            var foodObjectFriendly = fitnessTrackerGlobals.commonFunctions.removeUnselectedProperties(foodObject);
            var foodUuid = foodObject.identifierFoodProperties.foodUuid;
            var foodObjectIndex = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly, foodUuid);
            fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly.$set(foodObjectIndex, foodObjectFriendly);
        }

        function ensureValidWeight(weight)
        {
            var maxWeight = 100000;
            var minWeight = 0;
            if (weight < minWeight)
            {
                weight = minWeight;
            }

            if (weight > maxWeight)
            {
                weight = maxWeight;
            }

            return weight;
        }
        //privateHelpers functions
        return{
            updateSearchResultsArrayFriendly: updateSearchResultsArrayFriendly,
            ensureValidWeight: ensureValidWeight
        };
    }();

    var userFeedbackHtml = function () {

        var searchFeedback = function () {

            var noResultsFound = "<div class='alert alert-success' role='alert'>Search successful no results found :(</div>";
            var searchFailed = "<div class='alert alert-danger' role='alert'>Search failed</div>";
            var invalidSearchParameter = "<div class='alert alert-danger' role='alert'>Invalid search parameter, please type something into the search box</div>";
            var searchDefault = "<div class='alert alert-info' role='alert'>Please type the food to search for below</div>";


            function resultsFound(resultCount)
            {
                return "<div class='alert alert-success' role='alert'>Search successful " + resultCount + " results found!</div>";
            }

            //searchFeedback functions/variables
            return{
                noResultsFound: noResultsFound,
                resultsFound: resultsFound,
                searchFailed: searchFailed,
                invalidSearchParameter: invalidSearchParameter,
                searchDefault: searchDefault
            };

        }();

        //userFeedbackHtml functions/variables
        return{
            searchFeedback: searchFeedback
        };

    }();

    //foodLogPresentstion functions
    return {
        updateSearchResultMacros: updateSearchResultMacros,
        incrementDate: incrementDate,
        decrementDate: decrementDate,
        userFeedbackHtml: userFeedbackHtml
    };
}();