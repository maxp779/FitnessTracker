

/**
 * Clear the currentlyViewedDate variable from localStorage, this ensures that if
 * the user selects a date it will not persist between logins. e.g if the current day is 
 * 22/07/2016 and the user selects 16/07/2016 then upon next login the date will default back
 * to the current day and not stick at 16/07/2016 until the user changes it (this is desireable behaviour!)
 */
$(document).ready(function () {
    $(document).on("click", "#logout", function () {
        localStorage.removeItem("currentlyViewedDate");
    });
});

var setGlobalValues = {
    setUserStats: function (userStats, callback) {
        globalValues.userValues.userStats = userStats;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setCustomFoodsArray: function (customFoods, callback) {
        globalValues.userValues.customFoodsArray = customFoods;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setEatenFoodsArray: function (eatenFoods, callback) {
        globalValues.userValues.eatenFoodsArray = eatenFoods;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setSearchResultsArray: function (searchResults, callback) {
        globalValues.userValues.searchResultsArray = searchResults;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setFoodAttributes: function (foodAttributes, callback) {
        globalValues.userValues.foodAttributes = foodAttributes;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setFriendlyNames: function (friendlyNames, callback) {
        globalValues.friendlyValues.friendlyFoodAttributes = friendlyNames;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setTotalMacrosToday: function (totalMacros, callback) {
        globalValues.userValues.totalMacrosToday = totalMacros;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setNonOperableAttributes: function (nonOperableAttributes, callback) {
        globalValues.miscValues.nonOperableAttributes = nonOperableAttributes;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setWholeIntegerAttributes: function (wholeIntegerAttributes, callback) {
        globalValues.miscValues.wholeIntegerAttributes = wholeIntegerAttributes;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setTempUserStatsManual: function (tempUserStatsManual, callback) {
        globalValues.tempValues.tempUserStatsManual = tempUserStatsManual;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
    setTempUserStatsCalculated: function (tempUserStatsCalculated, callback) {
        globalValues.tempValues.tempUserStatsCalculated = tempUserStatsCalculated;
        globalFunctions.setGlobalValuesLocalStorage();
        if (callback) {
            callback();
        }
    },
};


var globalFunctionsAjax = {
    /**
     * gets the users stats from the server
     * 
     * @param {type} callback
     * @returns {undefined}
     */
    getUserStats: function (callback)
    {
        console.log("getUserStats()");
        $.ajax({
            url: serverAPI.requests.GET_USER_STATS,
            type: "GET",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getUserStats() succeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setUserStats(returnObject.data);
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }
                if (callback)
                {
                    callback();
                }
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    },
    getEatenFoodList: function (date, callback)
    {
        console.log("getEatenFoodList()" + date);

        //covert to Utc Unix time from local time
        var UnixTimeJson = {};
        UnixTimeJson.UnixTime = globalFunctions.getUnixDate(date);
        console.log("getEatenFoodList()" + JSON.stringify(UnixTimeJson));
        $.ajax({
            url: serverAPI.requests.GET_EATEN_FOOD_LIST,
            type: "GET",
            data: UnixTimeJson,
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getEatenFoodList() succeeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setEatenFoodsArray(returnObject.data);
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }

                if (callback)
                {
                    callback();
                }

            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    },
    getCustomFoodList: function (callback)
    {
        console.log("getCustomFoodList()");
        $.ajax({
            url: serverAPI.requests.GET_CUSTOM_FOOD_LIST,
            type: "GET",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getCustomFoodList() succeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setCustomFoodsArray(returnObject.data);
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }
                if (callback)
                {
                    callback();
                }
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    },
    getFriendlyNamesJSON: function (callback)
    {
        console.log("getFriendlyNamesJSON()");
        $.ajax({
            url: serverAPI.requests.GET_FRIENDLY_NAMES,
            type: "GET",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getFriendlyNamesJSON() succeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setFriendlyNames(returnObject.data);
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }
                if (callback)
                {
                    callback();
                }
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    },
    getFoodAttributes: function (callback)
    {
        console.log("getFoodAttributes()");
        $.ajax({
            url: serverAPI.requests.GET_VIEWABLE_ATTRIBUTES,
            type: "GET",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getFoodAttributes() succeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setFoodAttributes(returnObject.data);
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }
                if (callback)
                {
                    callback();
                }
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    },
    updateSelectedAttributes: function (newFoodAttributes, callback)
    {
        console.log("updateSelectedAttributes()");
        $.ajax({
            url: serverAPI.requests.MODIFY_SELECTED_ATTRIBUTES,
            type: "POST",
            data: JSON.stringify(newFoodAttributes),
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("updateSelectedAttributes() succeeded");
                    setGlobalValues.setFoodAttributes(returnObject.data);
                    document.getElementById("attributeFeedback").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Attributes updated successfully</div>";
                } else
                {
                    document.getElementById("attributeFeedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverAPI.errorCodes[returnObject.errorCode] + ", no action taken</div>";
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

    },
    /**
     *  This method is currently redundant however it has been left in as an 
     *  optional way to redirect the user to another page via an Ajax request.
     * @param {type} URL
     * @returns {undefined}
     */
    makeRedirectRequestAjax: function (URL)
    {
        console.log("makeRedirectRequestAjax()");
        $.ajax({
            url: URL,
            type: "POST",
            contentType: "application/json",
            success: function (returnedURL)
            {
                window.location = returnedURL;
            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
            }
        });
    },
    logout: function ()
    {
        $.ajax({
            url: serverAPI.requests.LOGOUT_REQUEST,
            type: "POST",
            dataType: "json",
            success: function (returnObject)
            {
                console.log("logout() returnObject.data:" + returnObject.data);
                if (returnObject.success === true)
                {
                    localStorage.setItem("loginState", false);
                    window.location.href = returnObject.data;
                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }

            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
            }
        });
    },
    getAllClientData: function (callback)
    {
        console.log("getAllClientData()");
        //get the date from the datepicker
        var UnixTimeJson = {};
        UnixTimeJson.UnixTime = globalFunctions.getUnixDate(globalFunctions.getCurrentlyViewedDate());

        console.log("getAllClientData()" + JSON.stringify(UnixTimeJson));
        $.ajax({
            url: serverAPI.requests.GET_ALL_CLIENT_DATA,
            type: "GET",
            data: UnixTimeJson,
            contentType: "application/json",
            dataType: "json",
            success: function (returnObject)
            {
                if (returnObject.success === true)
                {
                    console.log("getAllClientData() succeeded " + JSON.stringify(returnObject.data));
                    setGlobalValues.setCustomFoodsArray(returnObject.data.customFoods);
                    setGlobalValues.setFriendlyNames(returnObject.data.friendlyNames);
                    setGlobalValues.setFoodAttributes(returnObject.data.foodAttributes)
                    setGlobalValues.setUserStats(returnObject.data.userStats)
                    setGlobalValues.setEatenFoodsArray(returnObject.data.eatenFoods);

                } else
                {
                    console.log("Error:" + serverAPI.errorCodes[returnObject.errorCode]);
                }

                if (callback)
                {
                    callback();
                }

            },
            error: function (xhr, status, error)
            {
                console.log("Ajax request failed:" + error.toString());
                if (callback)
                {
                    callback();
                }
            }
        });
    }
};

/**
 * None of these functions are intended to be used directly! If I could I would
 * make them private
 * @type type
 */
var helperFunctions = {
}

var globalFunctions = {
    showSelectedAttributes: function (callback)
    {
        var foodAttributesRef = globalValues.userValues.foodAttributes;
        console.log("showSelectedAttributes(): current selected attributes " + JSON.stringify(foodAttributesRef));

        //clear form
        document.getElementById("editSelectedAttributesForm").reset();


        for (var currentProperty in foodAttributesRef)
        {
            var currentElementName = currentProperty.toString();
            currentElementName = currentElementName + "checkbox";
            var currentElement = document.getElementById(currentElementName);
            if (currentElement !== null)
            {
                if (foodAttributesRef[currentProperty] === true)
                {
                    currentElement.checked = true;
                }
            }
        }

        if (callback)
        {
            callback();
        }
    },
    /**
     * This method removes the need to call getAllGlobalValues() on new pages.
     * getAllGlobalValues can be called once when the user logs in and then the globalValues object
     * and the values it obtained from calling getAllGlobalValues() are stored in localStorage for retrieval later.
     * @param {type} callback
     * @returns {undefined}
     */
    refreshGlobalValuesFromLocalStorage: function (callback)
    {
        var localStorageContents = localStorage.getItem("globalValues");
        if (!globalFunctions.isUndefinedOrNull(localStorageContents))
        {
            globalValues = JSON.parse(localStorageContents);
        }

        if (callback)
        {
            callback();
        }
    },
    /**
     * This method updates the globalValues local storage object with the latest values
     * from the server
     * @param {type} callback
     * @returns {undefined}
     */
    setGlobalValuesLocalStorage: function (callback)
    {
        localStorage.setItem("globalValues", JSON.stringify(globalValues));

        if (callback)
        {
            callback();
        }
    },
//    getAllGlobalValues: function (callback)
//    {
//        globalFunctionsAjax["getFriendlyNamesJSON"](function () {
//            globalFunctionsAjax["getFoodAttributes"](function () {
//                globalFunctionsAjax["getUserStats"](function () {
//                    globalFunctionsAjax["getCustomFoodList"](function () {
//                        globalFunctionsAjax["getEatenFoodList"](function () {
//                            if (callback)
//                            {
//                                callback();
//                            }
//                        });
//                    });
//                });
//            });
//        });
//    },
    /**
     * A small but important method.
     * 
     * Each html element relating to a food that is dynamically generated is given an id. This id is based on
     * the numeric primary key in the database for that particular element e.g 
     * For a custom food id_customfood is the primary key which could be 1084. 
     * For an eaten food id_eatenfood is the primary key which could be 982.
     * 
     * To prevent conflict i.e in a situation where two elements having the same numeric id, a string is added to the end to differentiate the elements.
     * e.g if id_customfood is 1084 then its id will be "1084customfood". If id_eatenfood is 982
     * it will be "982eatenfood". This method simply removes the added characters leaving just the numeric id
     * for the database to operate on.
     * 
     * @param {type} id
     * @returns {id minus any characters}
     */
    removeCharacters: function (id)
    {
        var numericid = id.replace(/[a-z]/g, '');
        return numericid;
    },
    createFoodAttributesHTML: function (currentFoodJSON, foodIDType) //food ID is "id_searchablefood" or "id_customfood" etc, it defines the category of food object to look for
    {
        var outputHTML = "";
        var selectedAttributeArray = globalFunctions.getSelectedAttributes();
        var primaryAttributeArray = ["protein", "carbohydrate", "fat", "calorie", "weight"];
        var secondaryAttributeArray = [];
        var colorMapJSON = {"protein": "green", "carbohydrate": "blue", "fat": "orange", "calorie": "red", "weight": "black"};

        //the reason we have primary attributes is due to layout concerns
        //the primary attributes must be shown first and in the same order
        for (var index = 0; index < primaryAttributeArray.length; index++)
        {
            //if a primary attribute is not selected by the user
            if (selectedAttributeArray.indexOf(primaryAttributeArray[index]) === -1)
            {
                //remove from primaryAttributeArray
                primaryAttributeArray.splice(index, 1);
            }
        }

        for (var index = 0; index < selectedAttributeArray.length; index++)
        {
            var currentAttribute = selectedAttributeArray[index];
            if (!(currentAttribute === "protein" || currentAttribute === "carbohydrate" || currentAttribute === "fat"
                    || currentAttribute === "calorie" || currentAttribute === "foodname" || currentAttribute === "weight"))
            {
                secondaryAttributeArray.push(currentAttribute);
            }
        }

        outputHTML = outputHTML.concat("<div id='" + currentFoodJSON[foodIDType] + "macros'>"
                + "<strong>Name: </strong>" + currentFoodJSON["foodname"]
                + "<br>"
                + "<strong>Primary Macros: </strong>");

        for (var index = 0; index < primaryAttributeArray.length; index++)
        {
            var currentAttributeValue = currentFoodJSON[primaryAttributeArray[index]];
            outputHTML = outputHTML.concat("<font color='" + colorMapJSON[primaryAttributeArray[index]] + "'>" + globalValues.friendlyValues.friendlyFoodAttributes[primaryAttributeArray[index]] + ":");

            if (globalFunctions.isUndefinedOrNull(currentAttributeValue))
            {
                outputHTML = outputHTML.concat("? / </font>");
            } else
            {
                outputHTML = outputHTML.concat(currentAttributeValue + " / </font>");
            }
        }

        outputHTML = outputHTML.concat("<br>"
                + "<strong>Other info: </strong>");

        for (var index = 0; index < secondaryAttributeArray.length; index++)
        {
            var currentAttributeValue = currentFoodJSON[secondaryAttributeArray[index]];
            outputHTML = outputHTML.concat("<font color='#0099FF'>" + globalValues.friendlyValues.friendlyFoodAttributes[secondaryAttributeArray[index]] + ":");

            if (globalFunctions.isUndefinedOrNull(currentAttributeValue))
            {
                outputHTML = outputHTML.concat("? / </font>");
            } else
            {
                outputHTML = outputHTML.concat(currentAttributeValue + " / </font>");
            }

            //+ currentFoodJSON[secondaryAttributeArray[index]] + " </font>");
        }
        outputHTML = outputHTML.concat("</div>");
        return outputHTML;
    },
    getSelectedAttributes: function ()
    {
        var foodAttributesRef = globalValues.userValues.foodAttributes;
        var outputArray = [];

        for (var aProperty in foodAttributesRef)
        {
            if (foodAttributesRef[aProperty] === true)
            {
                outputArray.push(aProperty);
            }
        }
        outputArray.sort();

        return outputArray;
    },
    isUndefinedOrNull: function (aVariable)
    {
        var output;
        if (typeof aVariable === 'undefined' || aVariable === null)
        {
            output = true;
        } else
        {
            output = false;
        }
        return output;
    }, //Did not write this, no idea how it works :(
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
    /**
     * This function converts a forms serializeArray() output into a single
     * object.
     * 
     * e.g this array:
     * 
     * [{"name":"foodname", "value":"tasty pie"},{"name":"protein", "value":"25"}]
     * 
     * will be converted to:
     * 
     * {"foodname":"tasty pie", "protein":"25"}
     *
     * @param {type} formArray an array derived from serializeArray()
     * @returns a javascript object with the values from formArray
     */
    convertFormArrayToJSON: function (formArray)
    {
        var outputObject = {};

        for (var index = 0; index < formArray.length; index++)
        {
            var currentObject = formArray[index];
            /**
             * this condition prevents data like {"fat":""} being sent to the server
             * if we dont know the value theres no point in sending it
             */
            if (currentObject.value !== "")
            {
                outputObject[currentObject.name] = currentObject.value;
            }
        }
        return outputObject;
    },
    setupNavbar: function (callback)
    {
        console.log("setupNavbar()");
        var loginState = JSON.parse(localStorage.getItem("loginState"));
        console.log("loginState:" + loginState);
        if (loginState === true)
        {
            document.getElementById("myStats").href = serverAPI.requests.MY_STATS_PAGE_REQUEST;
            document.getElementById("workoutLog").href = serverAPI.requests.WORKOUT_LOG_PAGE_REQUEST;
            document.getElementById("macroLog").href = serverAPI.requests.MACRO_LOG_PAGE_REQUEST;
            document.getElementById("foodLog").href = serverAPI.requests.FOOD_LOG_PAGE_REQUEST;
            document.getElementById("customFoods").href = serverAPI.requests.CUSTOM_FOODS_PAGE_REQUEST;
            document.getElementById("settings").href = serverAPI.requests.SETTINGS_PAGE_REQUEST;
            document.getElementById("aboutPage").href = "../aboutPage/aboutPage.html";
            document.getElementById("cookiesPage").href = "../cookiesPolicyPage/cookiesPolicyPage.html";

            /**
             * "javascript:;" is used when a function is intended to be called when an href link is clicked
             * an empty string "" or "#" are alternatives but behave differently 
             * "javascript:;" is the most ideal
             */
            document.getElementById("logout").href = "javascript:;";

            $(document).on("click", "#logout", function () {
                globalFunctionsAjax.logout();
            });
        } else
        {
            var navbar = document.getElementById("navbar");
            navbar.style.display = "none";
        }

        if (callback)
        {
            callback();
        }
    },
    getUnixDate: function (inputDate)
    {
        console.log("getUnixDate() input date:" + inputDate);
        var inputDateUtcUnix = Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(),
                inputDate.getUTCDate(), inputDate.getUTCHours(), inputDate.getUTCMinutes(), inputDate.getUTCSeconds());
        inputDateUtcUnix = parseInt(inputDateUtcUnix / 1000);//convert from millisecond to second
        console.log("getUnixDate() output date:" + inputDateUtcUnix);

//Uncomment if DST must be accounted for manually
//        if (inputDate.dst())
//        {
//            console.log("daylight saving time in effect!");
//            inputDateUtcUnix = (inputDateUtcUnix + 3600);
//        }

        return inputDateUtcUnix;
    },
    /**
     * Sets the currently viewed date and stores it as a Unix Utc string in localstorage.
     * So it stores the number of milliseconds since 1st Jan 1970
     * @param {type} inputDate a Date object
     */
    setCurrentlyViewedDate: function (inputDate)
    {
        localStorage.setItem("currentlyViewedDate", inputDate.valueOf());
    },
    /**
     * Extracts the Unix Utc string in localstorage and returns the Date object
     * equivalent of that string
     * @returns {DOMString} currently viewed date as a Date object
     */
    getCurrentlyViewedDate: function ()
    {
        var currentlyViewedDate = new Date();
        var currentlyViewedDateString = localStorage.getItem("currentlyViewedDate");
        if (globalFunctions.isUndefinedOrNull(currentlyViewedDateString))
        {
            //return today if no stored date is found and store today
            globalFunctions.setCurrentlyViewedDate(currentlyViewedDate);
            return currentlyViewedDate;
        } else
        {
            //return the stored date
            currentlyViewedDate.setTime(currentlyViewedDateString);
            return currentlyViewedDate;
        }
    }



};


/**
 * This allows us to tell if daylight saving time is in effect. It is currently
 * NOT used but it does work and has been kept for possible future use.
 * @returns {Number}
 */
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};