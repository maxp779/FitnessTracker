/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//this focuses the page on the currently opened accordion panel
$(function () {
    $('#accordion2').on('shown.bs.collapse', function (e) {
        var offset = $('.panel.panel-default > .panel-collapse.in').offset();
        if (offset) {
            $('html,body').animate({
                scrollTop: $('.panel-title .bottomAccordion').offset().top - 20
            }, 500);
        }
    });
});

//function incrementDate()
//{
//    var currentlyViewedDateRef = fitnessTrackerGlobals.globalValues.miscValues.currentlyViewedDate;
//    currentlyViewedDateRef.setDate(currentlyViewedDateRef.getDate() + 1);
//    $('#foodDatePicker').datepicker('setDate', currentlyViewedDateRef);
//    $('#foodDatePicker').datepicker('update');
//}
//function decrementDate()
//{
//    var currentlyViewedDateRef = fitnessTrackerGlobals.globalValues.miscValues.currentlyViewedDate;
//    currentlyViewedDateRef.setDate(currentlyViewedDateRef.getDate() - 1);
//    $('#foodDatePicker').datepicker('setDate', currentlyViewedDateRef);
//    $('#foodDatePicker').datepicker('update');
//}


/**
 * A method to populate the custom food list for a particular user.
 * @returns {undefined} 
 */
function populateCustomFoodList()
{
    $('#customFoodList').empty();
    var innerHTML = "";
    var customFoodsArrayRef = fitnessTrackerGlobals.globalValues.userValues.customFoodsArray;
    //iterate through each JSON object (currentFood) in the Array
    //populates the foods eaten table, one row = one food item
    for (var index = 0; index < customFoodsArrayRef.length; index++)
    {
        var currentFoodJSON = customFoodsArrayRef[index];

        innerHTML = innerHTML.concat("<a href='javascript:void(0)' class='list-group-item customfood' id='" + currentFoodJSON["foodUuid"] + "'>"
                + fitnessTrackerGlobals.commonFunctions.createFoodAttributesHTML(currentFoodJSON, "foodUuid")
                + "</a>"
                );

    }
    document.getElementById("customFoodList").innerHTML = innerHTML;
}

//figure this one out later...
//var sort_by = function (field, reverse, primer) {
//
//    var key = primer ?
//            function (x) {
//                return primer(x[field])
//            } :
//            function (x) {
//                return x[field]
//            };
//
//    reverse = !reverse ? 1 : -1;
//
//    return function (a, b) {
//        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
//    }
//}

/**
 * A method to populate the search result list when the user searches the database
 * for a food.
 * @returns {undefined} 
 */
function populateSearchResultList()
{
    //empty table
    $('#searchResultList').empty();
    var searchResultArrayRef = fitnessTrackerGlobals.globalValues.userValues.searchResultsArray;

    if ($.isEmptyObject(searchResultArrayRef))
    {
        document.getElementById("searchResultList").innerHTML = "<li class='list-group-item searchresult'> No results </li>";
    } else
    {

        //sort list by size of "foodname" property
        searchResultArrayRef.sort(function (a, b) {
            return a.foodname.length - b.foodname.length;
        });

        var innerHTML = "";

        //iterate through each JSON object (currentFood) in the Array
        //populates the foods eaten table, one row = one food item
        for (var index = 0; index < searchResultArrayRef.length; index++)
        {
            var currentFoodObject = searchResultArrayRef[index];
            innerHTML = innerHTML.concat("<div class='row'>"
                    + "<div class='col-sm-12'>"
                    + "<a href='javascript:void(0)' class='list-group-item searchresult' id='" + currentFoodObject["id_searchablefood"] + "searchablefood" + "'>"
                    + "<div class='row'>"
                    + "<div class='col-sm-8'>"

                    + fitnessTrackerGlobals.commonFunctions.createFoodAttributesHTML(currentFoodObject, "id_searchablefood")

                    + "</div>"
                    + "<div class='col-sm-4'>"
                    + "<strong>Weight(g):</strong>"
                    + "<div class='input-group'>"
                    + "<span class='input-group-btn'>"
                    + "<button class='btn btn-primary decrementWeightButton' type='button' id='" + currentFoodObject["id_searchablefood"] + "decrementweight" + "'>-</button>"
                    + "</span>"
                    + "<input type='number' class='form-control searchresultInput' placeholder='Weight(g)' step='100' min='0' max='100000' id='" + currentFoodObject["id_searchablefood"] + "weight'" + "value='" + currentFoodObject["weight"] + "'>"
                    + "<span class='input-group-btn'>"
                    + "<button class='btn btn-primary incrementWeightButton' type='button' id='" + currentFoodObject["id_searchablefood"] + "incrementweight" + "'>+</button>"
                    + "</span>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</a>"

                    + "</div>"
                    + "</div>"
                    );
        }
        document.getElementById("searchResultList").innerHTML = innerHTML;
    }
}


/**
 * A function to populate the table containing the foods that 
 * the user has eaten
 * @returns {undefined}
 */
//function populateEatenFoodList()
//{
//    $('#eatenFoodList').empty();
//    var eatenFoodsArrayRef = fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArray;
//    var innerHTML = "";
//    //iterate through each JSON object (currentFood) in the Array
//    //populates the foods eaten table, one row = one food item
//    for (var index = 0; index < eatenFoodsArrayRef.length; index++)
//    {
//        var currentFoodJSON = eatenFoodsArrayRef[index];
//
//        innerHTML = innerHTML.concat("<div class='row'>"
//                + "<div class='col-sm-12'>"
//                + "<li class='list-group-item' id='" + currentFoodJSON["id_eatenfood"] + "eatenfood" + "'>"
//                + "<div class='row'>"
//                + "<div class='col-sm-8'>"
//
//                + fitnessTrackerGlobals.commonFunctions.createFoodAttributesHTML(currentFoodJSON)
//
//                + "</div>"
//                + "<div class='col-sm-4'>"
//                + "<p><button type='button' class='btn btn-danger btn-md pull-right' id='" + currentFoodJSON["id_eatenfood"] + "eatenfoodremove" + "'>Remove <span class='glyphicon glyphicon-remove'></span></button>"
//                + "<button type='button' class='btn btn-info btn-md pull-right' id='" + currentFoodJSON["id_eatenfood"] + "eatenfooddetails" + "'>Details <span class='glyphicon glyphicon-info-sign'></span></button></p>"
//                + "</div>"
//                + "</div>"
//                + "</li>"
//                + "</div>"
//                + "</div>"
//                );
//
//    }
//    document.getElementById("eatenFoodList").innerHTML = innerHTML;
//
//}



function populateEatenFoodList()
{
    //make deep copy of eatenFoodsArray, we dont want to modify the original!!




    var outputObject = {};
    outputObject.foods = eatenFoodsArrayDeepCopy;

    // Grab the template script
    var theTemplateScript = $("#eatenFoods").html();

    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);

    Handlebars.registerHelper("log", function (something) {
        console.log(something);
    });

    // Define our data object
//    var context = {
//        "city": "London",
//        "street": "Baker Street",
//        "number": "221B"
//    };

    //var context = fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArray;
    // Pass our data to the template
    var theCompiledHtml = theTemplate(outputObject);

    // Add the compiled html to the page
    $('#eatenFoodsList').html(theCompiledHtml);


//        var demo2 = new Vue({
//            el: '#demo2',
//            data: {
//                parentMsg: 'Hello',
//                eatenFoodsArray: fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArray
//            }
//        });
}

/**
 * A function to calculate the macros of a food based on the weight of the food.
 * The database only stores the food macros for 100g of each food.
 * So if user enters 250g of milk this method will calculate the amount of protein,carbs,fat,calories
 * for milk at that weight based off the values for 100g of milk.
 * 
 * @param {type} id_searchablefood
 * @param {type} foodObject
 * @returns {JSON}
 */
function calculateMacrosFromWeight(foodObject, foodUuid, newWeight)
{
    //ensure a valid weight is entered
    var maxWeight = 100000;
    var minWeight = 0;
    if (newWeight < minWeight)
    {
        newWeight = minWeight;
    }

    if (newWeight > maxWeight)
    {
        newWeight = maxWeight;
    }
    
    var foodObjectIndex = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.userValues.searchResultsArray, foodUuid);
    var baselineFoodObject = fitnessTrackerGlobals.globalValues.userValues.searchResultsArray[foodObjectIndex];
    
    //var currentFoodWeight = foodObject.primaryFoodAttributes.weight;
    var multiplier = newWeight / baselineFoodObject.primaryFoodAttributes.weight;

    for (var aProperty in baselineFoodObject.primaryFoodAttributes)
    {
        var baselineValue = baselineFoodObject.primaryFoodAttributes[aProperty];

        //if non operable e.g "foodname" then ignore
        //if (fitnessTrackerGlobals.globalValues.miscValues.nonOperableAttributes.indexOf(aProperty) === -1)
        //{
        //if operable but treated as float to 1 decimal place
        if (fitnessTrackerGlobals.globalValues.miscValues.wholeIntegerAttributes.indexOf(aProperty) === -1)
        {
            baselineValue = baselineValue * multiplier;
            foodObject.primaryFoodAttributes[aProperty] = baselineValue.toFixed(1);
        } else //if operable but integer
        {
            baselineValue = baselineValue * multiplier;
            foodObject.primaryFoodAttributes[aProperty] = baselineValue.toFixed(0);
        }
        //}
    }
    for (var aProperty in baselineFoodObject.secondaryFoodAttributes)
    {
        var baselineValue = baselineFoodObject.secondaryFoodAttributes[aProperty];

        //if non operable e.g "foodname" then ignore
        //if (fitnessTrackerGlobals.globalValues.miscValues.nonOperableAttributes.indexOf(aProperty) === -1)
        //{
        //if operable but treated as float to 1 decimal place
        if (fitnessTrackerGlobals.globalValues.miscValues.wholeIntegerAttributes.indexOf(aProperty) === -1)
        {
            baselineValue = baselineValue * multiplier;
            foodObject.secondaryFoodAttributes[aProperty] = baselineValue.toFixed(1);
        } else //if operable but integer
        {
            baselineValue = baselineValue * multiplier;
            foodObject.secondaryFoodAttributes[aProperty] = baselineValue.toFixed(0);
        }
        //}
    }
}



/**
 * Here the macros for foods are updated based on their weight. If the user searches for
 * "milk" and changes the default weight of 100 to 500 then this method is called and will
 * update the page reflecting that change. Instead of say 5g of protein it would show 25g etc.
 * 
 * @param {type} foodUuid
 * @returns {undefined}
 */
function updateSearchResultMacros(foodUuid, newWeight)
{
    //get the numbers from the id, it is the id of the inputbox that is passed
    //which takes the form of "id_searchablefood + weight" e.g. 2500weight
    //we need the number which alone links to the searchablefood we need to change
//    var id_searchablefood = id.replace(/[a-z]/g, '');
//    console.log("updating macros for:" + id_searchablefood);
//    var id_searchablefoodmacros = document.getElementById(id_searchablefood + "macros");
//    var currentFood = {};
//    var searchResultArrayRef = fitnessTrackerGlobals.globalValues.userValues.searchResultsArray;
//
//    for (var aFood in searchResultArrayRef)
//    {
//        if (searchResultArrayRef[aFood].id_searchablefood === id_searchablefood)
//        {
//            var matchingFood = searchResultArrayRef[aFood];
//            for (var currentProperty in matchingFood)
//            {
//                currentFood[currentProperty] = matchingFood[currentProperty];
//            }
//        }
//    }

    var foodObjectIndex = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray, foodUuid);
    var foodObject = fitnessTrackerGlobals.globalValues.tempValues.tempSearchResultsArray[foodObjectIndex];
    calculateMacrosFromWeight(foodObject, foodUuid, newWeight);

    //update searchResultsArray
    //should be done already? foodObject is a reference to the array item I think

    //get duplicate friendly object equivalent
    var foodObjectFriendly = fitnessTrackerGlobals.commonFunctions.createFriendlyFood(foodObject);

    //update searchResultsArrayFriendly
    var foodObjectIndexFriendly = fitnessTrackerGlobals.commonFunctions.findFoodIndexByUuid(fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly, foodUuid);
    fitnessTrackerGlobals.globalValues.friendlyValues.searchResultsArrayFriendly.$set(foodObjectIndexFriendly, foodObjectFriendly);

    //remove old food
//    var index = -1;
//    for (var count = 0; count < fitnessTrackerGlobals.globalValues.userValues.searchResultsArray.length; count++) {
//        if (fitnessTrackerGlobals.globalValues.userValues.searchResultsArray[count].identifierFoodAttributes === foodUuid) {
//            index = count;
//            break;
//        }
//    }
//    fitnessTrackerGlobals.globalValues.userValues.searchResultsArray.splice(index, 1);
//
//    //add updated food
//    fitnessTrackerGlobals.globalValues.userValues.searchResultsArray.push(updatedFood)
//
//    //call this to update friendly value equivalent
//    fitnessTrackerGlobals.setGlobalValues.setSearchResultsArray(fitnessTrackerGlobals.globalValues.userValues.searchResultsArray);
    //var innerHTML = fitnessTrackerGlobals.commonFunctions.createFoodAttributesHTML(updatedFood, "id_searchablefood");
    //id_searchablefoodmacros.innerHTML = innerHTML;

}


function updateFoodLogPage()
{
    //populateEatenFoodList();
    //populateCustomFoodList();
    //populateSearchResultList();
    // console.log("eatenfoods array foodLogPresentation.js");
    // console.log(fitnessTrackerGlobals.globalValues.userValues.eatenFoodsArray);
}
