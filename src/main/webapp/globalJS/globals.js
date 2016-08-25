/**
 * Clear the currentlyViewedDate variable from localStorage, this ensures that if
 * the user selects a date it will not persist between logins. e.g if the current day is 
 * 22/07/2016 and the user selects 16/07/2016 then upon next login the date will default back
 * to the current day and not stick at 16/07/2016 until the user changes it (this is desireable behaviour!)
 */
jQuery(document).ready(function () {
    jQuery(document).on("click", "#logout", function () {
        localStorage.removeItem("currentlyViewedDate");
    });
});
var fitnessTrackerGlobals = function () {

    var ajaxFunctions = function () {

        function getUserStats(callback)
        {
            console.log("getUserStats()");
            jQuery.ajax({
                url: serverApi.requests.GET_USER_STATS,
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
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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

        function getEatenFoodList(date, callback)
        {
            console.log("getEatenFoodList()" + date);
            //covert to Utc Unix time from local time
            var UnixTimeJson = {};
            UnixTimeJson.UnixTime = commonFunctions.getUnixDate(date);
            console.log("getEatenFoodList()" + JSON.stringify(UnixTimeJson));
            jQuery.ajax({
                url: serverApi.requests.GET_EATEN_FOOD_LIST,
                type: "GET",
                data: UnixTimeJson,
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        console.log("getEatenFoodList() succeeded")
                        console.log(returnObject.data);
                        setGlobalValues.setEatenFoodsArray(returnObject.data);
                    } else
                    {
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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

        function getCustomFoodList(callback)
        {
            console.log("getCustomFoodList()");
            jQuery.ajax({
                url: serverApi.requests.GET_CUSTOM_FOOD_LIST,
                type: "GET",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        console.log("getCustomFoodList() succeded");
                        console.log(returnObject.data);
                        setGlobalValues.setCustomFoodsArray(returnObject.data);
                    } else
                    {
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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

        function getFriendlyNamesJSON(callback)
        {
            console.log("getFriendlyNamesJSON()");
            jQuery.ajax({
                url: serverApi.requests.GET_FRIENDLY_NAMES,
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
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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
        function getSelectedFoodProperties(callback)
        {
            jQuery.ajax({
                url: serverApi.requests.GET_VIEWABLE_ATTRIBUTES,
                type: "GET",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        setGlobalValues.setFoodAttributes(returnObject.data);
                    } else
                    {
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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

        /**
         *  This method is currently redundant however it has been left in as an 
         *  optional way to redirect the user to another page via an Ajax request.
         * @param {type} URL
         * @returns {undefined}
         */
        function makeRedirectRequestAjax(URL)
        {
            console.log("makeRedirectRequestAjax()");
            jQuery.ajax({
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
        }
        function logout()
        {
            jQuery.ajax({
                url: serverApi.requests.LOGOUT_REQUEST,
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
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
                    }

                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }
        function getAllClientData(callback)
        {
            console.log("getAllClientData()");
            //get the date from the datepicker
            var UnixTimeJson = {};
            UnixTimeJson.UnixTime = commonFunctions.getUnixDate(commonFunctions.getCurrentlyViewedDate());
            console.log("getAllClientData()" + JSON.stringify(UnixTimeJson));
            jQuery.ajax({
                url: serverApi.requests.GET_ALL_CLIENT_DATA,
                type: "GET",
                data: UnixTimeJson,
                contentType: "application/json",
                dataType: "json",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        console.log("getAllClientData() succeeded");
                        console.log(returnObject.data);

                        setGlobalValues.setUserStats(returnObject.data.userStats);

                        /**
                         * setFoodAttributes and setFriendlyNames must be done first to ensure the friendly varients of customFoodsArray
                         * and eatenFoodsArray (customFoodsArrayFriendy and eatenFoodsArrayFriendly) are initialized properly
                         */
                        setGlobalValues.setFriendlyFoodProperties(returnObject.data.friendlyFoodProperties, function () {
                            setGlobalValues.setSelectedFoodProperties(returnObject.data.selectedFoodProperties, function () {
                                setGlobalValues.setCustomFoodsArray(returnObject.data.customFoods);
                                setGlobalValues.setEatenFoodsArray(returnObject.data.eatenFoods);
                            });
                        });

                    } else
                    {
                        console.log("Error:" + serverApi.errorCodes[returnObject.errorCode]);
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

        /**
         * This gets the serverApi object from the server. It is needed so the other
         * functions can make their requests using values from the serverApi object. 
         * This is the only function that uses a hard coded request URL 
         * i.e "/FrontControlerServlet/GET_SERVER_API"
         * @param {type} callback
         * @returns serverApi object in the form of:
         * 
         * {
         * "serverApi": {
         * "errorCodes": {
         * "10": "SAMPLE_ERROR1",
         * "11": "SAMPLE_ERROR2",
         * "12": "SAMPLE_ERROR3"
         * },
         * "requests": {
         * "SAMPLE_REQUEST1": "/FrontControllerServlet/SAMPLE_REQUEST1",
         * "SAMPLE_REQUEST2": "/FrontControllerServlet/SAMPLE_REQUEST2",
         * "SAMPLE_REQUEST3": "/FrontControllerServlet/SAMPLE_REQUEST3"
         * }
         * }
         * }
         */
        function getServerAPI(callback)
        {
            console.log("getServerAPI()");
            jQuery.ajax({
                dataType: "json",
                type: "GET",
                url: "/FrontControllerServlet/GET_SERVER_API",
                success: function (returnObject)
                {
                    if (returnObject.success === true)
                    {
                        serverApi = returnObject.data;
                        localStorage.setItem("serverApi", JSON.stringify(returnObject.data));
                        if (callback)
                        {
                            callback();
                        }
                    } else
                    {
                        console.log("Error 0: Failed to fetch API from server");
                    }

                },
                error: function (xhr, status, error)
                {
                    console.log("Ajax request failed:" + error.toString());
                }
            });
        }

        return{
            getUserStats: getUserStats,
            getEatenFoodList: getEatenFoodList,
            getCustomFoodList: getCustomFoodList,
            getFriendlyNamesJSON: getFriendlyNamesJSON,
            getSelectedFoodProperties: getSelectedFoodProperties,
            makeRedirectRequestAjax: makeRedirectRequestAjax,
            logout: logout,
            getAllClientData: getAllClientData,
            getServerAPI: getServerAPI
        };
    }();
    var commonFunctions = function () {

        /**
         * Creates a copy of the unformattedObject and organizes its properties 
         * in the standardFoodObject format:
         * 
         * {
         * primaryFoodProperties:
         * secondaryFoodProperties:
         * vitamins:
         * minerals
         * identifierFoodProperties:
         * descriptiveFoodProperties:
         * }
         * 
         * Intended for manually added food objects but can be used with other objects
         * as appropriate.
         * @param {type} unformattedObject
         * @returns {Object} a copy of unformattedObject, formatted as a standardFoodObject
         */
        function organizeObject(unformattedObject)
        {
            var formattedObject = jQuery.extend(true, {}, serverApi.standardFoodObject);

            for (var unformattedFoodProperty in unformattedObject)
            {
                for (var subCategory in formattedObject)
                {
                    if (formattedObject[subCategory].hasOwnProperty(unformattedFoodProperty))
                    {
                        formattedObject[subCategory][unformattedFoodProperty] = unformattedObject[unformattedFoodProperty];
                    }
                }
            }
            return formattedObject;
        }


        /**
         * This will empty all arrays watched by vuejs and refill them forcing
         * them to be rendered again. This function should not be used often!
         * 
         * It was implemented for when the user changes their selected properties
         * which is not a common occurrance.
         * @returns {undefined}
         */
        function reRenderAllWatchedArrays()
        {

            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.searchResultsArrayFriendly,
                    globalValues.userValues.searchResultsArray);
            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.customFoodsArrayFriendly,
                    globalValues.userValues.customFoodsArray);
            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.eatenFoodsArrayFriendly,
                    globalValues.userValues.eatenFoodsArray, function () {
                        commonFunctions.setGlobalValuesLocalStorage();

                    });
        }

        /**
         * This method takes a food object, creates a copy of it and returns the copy with
         * friendly properties replacing the unfriendly ones. By default it will also remove unselected properties although
         * this can be set to false so it wont remove any properties.
         * 
         * @param {type} unfriendlyFoodObject a food object whos properties are "satfod" instead of "Saturated Fat" etc
         * @param {type} removeUnselectedFoodProperties option to remove properties the user hasent selected, defaults to true
         * @returns {Object}
         */
//        function createFriendlyFood(unfriendlyFoodObject, removeUnselectedFoodProperties)
//        {
//            var friendlyFood = jQuery.extend(true, {}, unfriendlyFoodObject);
//            //var friendlyFoodProperties = globalValues.friendlyValues.friendlyFoodProperties;
//
//            if (isUndefinedOrNull(removeUnselectedFoodProperties) || removeUnselectedFoodProperties === true)
//            {
//                friendlyFood = removeUnselectedProperties(friendlyFood);
//            }
//
////            for (var unfriendlyProperty in friendlyFood.primaryFoodProperties)
////            {
////                if (friendlyFoodProperties.hasOwnProperty(unfriendlyProperty))
////                {
////                    var friendlyAttribute = friendlyFoodProperties[unfriendlyProperty];
////                    var unfriendlyPropertyValue = friendlyFood.primaryFoodProperties[unfriendlyProperty];
////
////                    friendlyFood.primaryFoodProperties[friendlyAttribute] = unfriendlyPropertyValue;
////                    delete friendlyFood.primaryFoodProperties[unfriendlyProperty];
////                }
////            }
////
////            for (var unfriendlyProperty in friendlyFood.secondaryFoodProperties)
////            {
////                if (friendlyFoodProperties.hasOwnProperty(unfriendlyProperty))
////                {
////                    var friendlyAttribute = friendlyFoodProperties[unfriendlyProperty];
////                    var unfriendlyPropertyValue = friendlyFood.secondaryFoodProperties[unfriendlyProperty];
////
////                    friendlyFood.secondaryFoodProperties[friendlyAttribute] = unfriendlyPropertyValue;
////                    delete friendlyFood.secondaryFoodProperties[unfriendlyProperty];
////                }
////            }
//
//            return friendlyFood;
//        }

        /**
         * Returns a copy of the foodObject with unselected properties removed, does
         * not affect the original object.
         * 
         * @param {type} foodObject
         * @returns {Object}
         */
        function removeUnselectedProperties(foodObject)
        {
            var outputFood = jQuery.extend(true, {}, foodObject);

            /**
             * Here we remove the primaryFoodProperties and secondaryFoodProperties the user
             * dosent want to see
             * note: descriptiveFoodProperties and identifierFoodProperties are NOT user modifiable
             * so we leave these untouched
             */

            for (var primaryProperty in outputFood.primaryFoodProperties)
            {
                if (!fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[primaryProperty])
                {
                    delete outputFood.primaryFoodProperties[primaryProperty];
                }
            }

            for (var secondaryProperty in outputFood.secondaryFoodProperties)
            {
                if (!fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[secondaryProperty])
                {
                    delete outputFood.secondaryFoodProperties[secondaryProperty];
                }
            }
            return outputFood;
        }

        function removeSecondaryPropertiesIfEmpty(foodObject)
        {
            var outputFood = jQuery.extend(true, {}, foodObject);

            if (jQuery.isEmptyObject(outputFood.secondaryFoodProperties))
            {
                delete outputFood.secondaryFoodProperties;
            }
            return outputFood;
        }
        /**
         * Returns the index of the food object with the specified uuid or -1 if
         * nothing was found.
         * 
         * @param {type} anArray
         * @param {type} inputUuid
         * @returns {unresolved}
         */
        function findFoodIndexByUuid(anArray, inputUuid)
        {
            function findFood(element, index, array) {

                if (element.identifierFoodProperties.foodUuid === inputUuid)
                {
                    return true;
                } else
                {
                    return false;
                }
            }

            return anArray.findIndex(findFood);
        }

        /**
         * Returns a reference to the food object with the specified uuid or undefined
         * if it is not found.
         * 
         * @param {type} anArray
         * @param {type} inputUuid
         * @returns {unresolved}
         */
        function findFoodObjectByUuid(anArray, inputUuid)
        {
            function findFood(element, index, array) {

                if (element.identifierFoodProperties.foodUuid === inputUuid)
                {
                    return true;
                } else
                {
                    return false;
                }
            }

            return anArray.find(findFood);
        }

        /**
         * Returns a reference to the food object with the specified uuid or undefined
         * if it is not found. This method searches ALL arrays, eatenFoodsArray, customFoodsArray
         * and searchResultsArray for the specified food.
         * 
         * @param {type} inputUuid
         * @returns {unresolved}
         */
        function findFoodByUuidSearchAllArrays(inputUuid)
        {
            var foodObject;
            foodObject = findFoodObjectByUuid(globalValues.userValues.eatenFoodsArray, inputUuid);

            if (commonFunctions.isUndefinedOrNull(foodObject))
            {
                foodObject = findFoodObjectByUuid(globalValues.userValues.customFoodsArray, inputUuid);
            }

            if (commonFunctions.isUndefinedOrNull(foodObject))
            {
                foodObject = findFoodObjectByUuid(globalValues.userValues.searchResultsArray, inputUuid);
            }
            return foodObject;
        }

        /**
         * This method removes the need to call getAllGlobalValues() on new pages.
         * getAllGlobalValues can be called once when the user logs in and then the globalValues object
         * and the values it obtained from calling getAllGlobalValues() are stored in localStorage for retrieval later.
         * @param {type} callback
         * @returns {undefined}
         */
//        function refreshGlobalValuesFromLocalStorage(callback) //deprecation candidate
//        {
//            var localStorageContents = localStorage.getItem("globalValues");
//            console.log("refreshGlobalValuesFromLocalStorage() local storage contents: " + localStorageContents);
//            if (!commonFunctions.isUndefinedOrNull(localStorageContents))
//            {
//                globalValues = JSON.parse(localStorageContents);
//            }
//
//            if (callback)
//            {
//                callback();
//            }
//        }

        /**
         * This method updates the globalValues local storage object with the latest values
         * from the server
         * @param {type} callback
         * @returns {undefined}
         */
        function setGlobalValuesLocalStorage(callback)
        {
            localStorage.setItem("globalValues", JSON.stringify(globalValues));
            if (callback)
            {
                callback();
            }
        }

        //createFoodAttributesHTML deprecation candidate!!
//        function createFoodAttributesHTML(foodUuid) //food ID is "id_searchablefood" or "id_customfood" etc, it defines the category of food object to look for
//        {
//            var outputHTML = "";
//            var selectedAttributeArray = commonFunctions.getSelectedProperties();
//            var primaryPropertyArray = ["protein", "carbohydrate", "fat", "calorie", "weight"];
//            var secondaryPropertyArray = [];
//            var colorMapJSON = {"protein": "green", "carbohydrate": "blue", "fat": "orange", "calorie": "red", "weight": "black"};
//            //the reason we have primary properties is due to layout concerns
//            //the primary properties must be shown first and in the same order
//            for (var index = 0; index < primaryPropertyArray.length; index++)
//            {
//                //if a primary property is not selected by the user
//                if (selectedAttributeArray.indexOf(primaryPropertyArray[index]) === -1)
//                {
//                    //remove from primaryPropertyArray
//                    primaryPropertyArray.splice(index, 1);
//                }
//            }
//
//            for (var index = 0; index < selectedAttributeArray.length; index++)
//            {
//                var currentAttribute = selectedAttributeArray[index];
//                if (!(currentAttribute === "protein" || currentAttribute === "carbohydrate" || currentAttribute === "fat"
//                        || currentAttribute === "calorie" || currentAttribute === "foodname" || currentAttribute === "weight"))
//                {
//                    secondaryPropertyArray.push(currentAttribute);
//                }
//            }
//
//            outputHTML = outputHTML.concat("<div id='" + currentFoodJSON[foodIDType] + "macros'>"
//                    + "<strong>Name: </strong>" + currentFoodJSON["foodname"]
//                    + "<br>"
//                    + "<strong>Primary Macros: </strong>");
//            for (var index = 0; index < primaryPropertyArray.length; index++)
//            {
//                var currentAttributeValue = currentFoodJSON[primaryPropertyArray[index]];
//                outputHTML = outputHTML.concat("<font color='" + colorMapJSON[primaryPropertyArray[index]] + "'>" + globalValues.friendlyValues.friendlyFoodProperties[primaryPropertyArray[index]] + ":");
//                if (commonFunctions.isUndefinedOrNull(currentAttributeValue))
//                {
//                    outputHTML = outputHTML.concat("? / </font>");
//                } else
//                {
//                    outputHTML = outputHTML.concat(currentAttributeValue + " / </font>");
//                }
//            }
//
//            outputHTML = outputHTML.concat("<br>"
//                    + "<strong>Other info: </strong>");
//            for (var index = 0; index < secondaryPropertyArray.length; index++)
//            {
//                var currentAttributeValue = currentFoodJSON[secondaryPropertyArray[index]];
//                outputHTML = outputHTML.concat("<font color='#0099FF'>" + globalValues.friendlyValues.friendlyFoodProperties[secondaryPropertyArray[index]] + ":");
//                if (commonFunctions.isUndefinedOrNull(currentAttributeValue))
//                {
//                    outputHTML = outputHTML.concat("? / </font>");
//                } else
//                {
//                    outputHTML = outputHTML.concat(currentAttributeValue + " / </font>");
//                }
//
//                //+ currentFoodJSON[secondaryPropertyArray[index]] + " </font>");
//            }
//            outputHTML = outputHTML.concat("</div>");
//            return outputHTML;
//        }

        /**
         * This will return an object containing ONLY the food properties with a true value
         * i.e the ones the user wants to see. 
         * @returns {Array}
         */
//        function getSelectedProperties()
//        {
//            var selectedFoodPropertiesRef = globalValues.userValues.selectedFoodProperties;
//            var outputObject = {};
//            for (var aProperty in selectedFoodPropertiesRef)
//            {
//                if (selectedFoodPropertiesRef[aProperty] === true)
//                {
//                    outputObject[aProperty] = true;
//                }
//            }
//            return outputObject;
//        }

        function isUndefinedOrNull(aVariable)
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
        }

        //Did not write this, no idea how it works :(
        function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|jQuery)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }

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
        function convertFormArrayToJSON(formArray)
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
        }

        function setupNavbar(callback)
        {
            console.log("setupNavbar()");
            var loginState = JSON.parse(localStorage.getItem("loginState"));
            console.log("loginState:" + loginState);
            if (loginState === true)
            {
                document.getElementById("myStats").href = serverApi.requests.MY_STATS_PAGE_REQUEST;
                document.getElementById("workoutLog").href = serverApi.requests.WORKOUT_LOG_PAGE_REQUEST;
                document.getElementById("macroLog").href = serverApi.requests.MACRO_LOG_PAGE_REQUEST;
                document.getElementById("foodLog").href = serverApi.requests.FOOD_LOG_PAGE_REQUEST;
                document.getElementById("customFoods").href = serverApi.requests.CUSTOM_FOODS_PAGE_REQUEST;
                document.getElementById("settings").href = serverApi.requests.SETTINGS_PAGE_REQUEST;
                document.getElementById("aboutPage").href = "../aboutPage/aboutPage.html";
                document.getElementById("cookiesPage").href = "../cookiesPolicyPage/cookiesPolicyPage.html";
                /**
                 * "javascript:;" is used when a function is intended to be called when an href link is clicked
                 * an empty string "" or "#" are alternatives but behave differently 
                 * "javascript:;" is the most ideal
                 */
                document.getElementById("logout").href = "javascript:;";
                jQuery(document).on("click", "#logout", function () {
                    ajaxFunctions.logout();
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
        }

        function getUnixDate(inputDate)
        {
            console.log("getUnixDate() input date:" + inputDate);
            var inputDateUtcUnix = Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(),
                    inputDate.getUTCDate(), inputDate.getUTCHours(), inputDate.getUTCMinutes(), inputDate.getUTCSeconds());
            inputDateUtcUnix = parseInt(inputDateUtcUnix / 1000); //convert from millisecond to second
            console.log("getUnixDate() output date:" + inputDateUtcUnix);
//Uncomment if DST must be accounted for manually
//        if (inputDate.dst())
//        {
//            console.log("daylight saving time in effect!");
//            inputDateUtcUnix = (inputDateUtcUnix + 3600);
//        }

            return inputDateUtcUnix;
        }

        /**
         * Sets the currently viewed date and stores it as a Unix Utc string in localstorage.
         * So it stores the number of milliseconds since 1st Jan 1970
         * @param {type} inputDate a Date object
         */
        function setCurrentlyViewedDate(inputDate)
        {
            localStorage.setItem("currentlyViewedDate", inputDate.valueOf());
        }

        /**
         * Extracts the Unix Utc string in localstorage and returns the Date object
         * equivalent of that string
         * @returns {DOMString} currently viewed date as a Date object
         */
        function getCurrentlyViewedDate()
        {
            var currentlyViewedDate = new Date();
            var currentlyViewedDateString = localStorage.getItem("currentlyViewedDate");
            if (commonFunctions.isUndefinedOrNull(currentlyViewedDateString))
            {
                //return today if no stored date is found and store today
                commonFunctions.setCurrentlyViewedDate(currentlyViewedDate);
                return currentlyViewedDate;
            } else
            {
                //return the stored date
                currentlyViewedDate.setTime(currentlyViewedDateString);
                return currentlyViewedDate;
            }
        }

        //fitnessTrackerGlobals.commonFunctions functions
        return{
            reRenderAllWatchedArrays: reRenderAllWatchedArrays,
            //createFriendlyFood: createFriendlyFood,
            removeUnselectedProperties: removeUnselectedProperties,
            findFoodIndexByUuid: findFoodIndexByUuid,
            findFoodObjectByUuid: findFoodObjectByUuid,
            findFoodByUuidSearchAllArrays: findFoodByUuidSearchAllArrays,
            setGlobalValuesLocalStorage: setGlobalValuesLocalStorage,
            //createFoodAttributesHTML: createFoodAttributesHTML,
            //getSelectedProperties: getSelectedProperties,
            removeSecondaryPropertiesIfEmpty: removeSecondaryPropertiesIfEmpty,
            isUndefinedOrNull: isUndefinedOrNull,
            getURLParameter: getURLParameter,
            convertFormArrayToJSON: convertFormArrayToJSON,
            setupNavbar: setupNavbar,
            getUnixDate: getUnixDate,
            setCurrentlyViewedDate: setCurrentlyViewedDate,
            getCurrentlyViewedDate: getCurrentlyViewedDate,
            organizeObject: organizeObject
        };
    }();
    var globalValues = function () {

        /**
         * Values sent from the server are stored here
         */
        var userValues = {
            userStats: {}, //an object containing the users ideal protein/carb/fat/calorie consumption values, they set these up themselves

            customFoodsArray: [], //an array of objects which represent the current users custom foods
            eatenFoodsArray: [], //an array of objects which represent the current users eaten foods
            searchResultsArray: [], //an array of objects which represent the current users search results if they searched the database

            selectedFoodProperties: {}, //a single object containing ALL supported food properties and defines if the user wants to see a particular property 
            //e.g {"protein":true,"fat":false} if the user wants to see protein content but not fat

            totalMacrosToday: {} //the total of all food properties of the eaten foods e.g total protein today, total fat today etc

        };
        /**
         * Here userValues modified with friendly values for displaying are stored, these are what should be shown to the user
         * They contain property names like "Saturated Fats" instead of "satfod" etc.
         */

        var miscValues = {
            nonOperableProperties: ["foodcode", "foodname", "foodnameoriginal", "description",
                "foodgroup", "previous", "foodreferences", "footnote", "id_user", "id_eatenfood", "id_searchablefood", "timestamp"], //properties that should not be operated on mathematically
            wholeIntegerProperties: ["calorie", "kj", "weight"], //properties that are whole integers as opposed to floats

            //these values are used by the passwordStrength.js and emailValid.js to validate a password and check if two emails match.
            passwordValid: false,
            emailValid: false
        };
        var friendlyValues = {
            friendlyFoodProperties: {}, //friendly names for the food properties e.g {"satfod":"Saturated fat","totsug":"Total Sugar"}
            eatenFoodsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
            customFoodsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
            searchResultsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
            selectedFoodPropertiesFriendly: {},
            errorCodeHints: {} //hints for the error codes
        };
        var tempValues = {
            tempSearchResultsArray: [],
            /**
             * These are stored seperately to avoid a situation where the user uses the calculator, clicks save
             * then manually enters their own stats, then decides they want to go back to the calcualtors values again
             * so they click save again, but it dosent work because the manual entry would have already overwritten the previously caluclated stats.
             * The user would have to click calculate again.
             */
            tempUserStatsManual: {}, //manually entered stats are stored here, if the user chooses to save them they become userValues.userStats
            tempUserStatsCalculated: {} //calculated stats are stored here, if the user chooses to save them they become userValues.userStats
        };
        /**
         * This if condition fetches any stored globalValues from localStorage
         * automatically, this removes the need to call the old 
         * refreshGlobalValuesFromLocalStorage() method.
         */
        var storedGlobalValues = localStorage.getItem("globalValues");
        if (!commonFunctions.isUndefinedOrNull(storedGlobalValues))
        {
            storedGlobalValues = JSON.parse(storedGlobalValues);
            userValues = storedGlobalValues.userValues;
            miscValues = storedGlobalValues.miscValues;
            friendlyValues = storedGlobalValues.friendlyValues;
            tempValues = storedGlobalValues.tempValues;
        }

        return {
            userValues: userValues,
            miscValues: miscValues,
            friendlyValues: friendlyValues,
            tempValues: tempValues
        };
    }();
    var setGlobalValues = function () {
        function setUserStats(userStats, callback) {
            globalValues.userValues.userStats = userStats;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }

        function setCustomFoodsArray(customFoods, callback) {
            globalValues.userValues.customFoodsArray = customFoods;
            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.customFoodsArrayFriendly,
                    globalValues.userValues.customFoodsArray,
                    function ()
                    {
                        commonFunctions.setGlobalValuesLocalStorage();
                    });
            if (callback) {
                callback();
            }
        }
        function setEatenFoodsArray(eatenFoods, callback) {
            globalValues.userValues.eatenFoodsArray = eatenFoods;
            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.eatenFoodsArrayFriendly,
                    globalValues.userValues.eatenFoodsArray,
                    function ()
                    {
                        commonFunctions.setGlobalValuesLocalStorage();
                    });

            if (callback) {
                callback();
            }
        }
        function setSearchResultsArray(searchResults, callback) {
            globalValues.userValues.searchResultsArray = searchResults;
            globalValues.tempValues.tempSearchResultsArray = jQuery.extend(true, [], searchResults);

            privateHelperFunctions.updateFriendlyArray(
                    globalValues.friendlyValues.searchResultsArrayFriendly
                    , globalValues.userValues.searchResultsArray
                    , function ()
                    {
                        commonFunctions.setGlobalValuesLocalStorage();
                    }
            , false);
            if (callback) {
                callback();
            }
        }
        function setSelectedFoodProperties(newSelectedProperties, callback) {
            globalValues.userValues.selectedFoodProperties = newSelectedProperties;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setFriendlyFoodProperties(friendlyProperties, callback) {
            globalValues.friendlyValues.friendlyFoodProperties = friendlyProperties;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setTotalMacrosToday(totalMacros, callback) {
            globalValues.userValues.totalMacrosToday = totalMacros;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setNonOperableAttributes(nonOperableAttributes, callback) {
            globalValues.miscValues.nonOperableAttributes = nonOperableAttributes;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setWholeIntegerAttributes(wholeIntegerProperties, callback) {
            globalValues.miscValues.wholeIntegerProperties = wholeIntegerProperties;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setTempUserStatsManual(tempUserStatsManual, callback) {
            globalValues.tempValues.tempUserStatsManual = tempUserStatsManual;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setTempUserStatsCalculated(tempUserStatsCalculated, callback) {
            globalValues.tempValues.tempUserStatsCalculated = tempUserStatsCalculated;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }

        return{
            setUserStats: setUserStats,
            setCustomFoodsArray: setCustomFoodsArray,
            setEatenFoodsArray: setEatenFoodsArray,
            setSearchResultsArray: setSearchResultsArray,
            setSelectedFoodProperties: setSelectedFoodProperties,
            setFriendlyFoodProperties: setFriendlyFoodProperties,
            setTotalMacrosToday: setTotalMacrosToday,
            setNonOperableAttributes: setNonOperableAttributes,
            setWholeIntegerAttributes: setWholeIntegerAttributes,
            setTempUserStatsManual: setTempUserStatsManual,
            setTempUserStatsCalculated: setTempUserStatsCalculated

        };
    }();
    /**
     * For robustness serverApi is checked on each page load, if it has been cleared
     * from localStorage possibly due to user action it will be re-requested again.
     * 
     * Unfortunately this means it will be called twice on initial login, once here and also again
     * from loginPage.js
     */
    var serverApi = function () {
        var storedApi = JSON.parse(localStorage.getItem("serverApi"));
        //if serverApi is not found i.e on first login, we fetch it
        if (commonFunctions.isUndefinedOrNull(storedApi))
        {
            //getServerAPI will store the fetched serverApi in localStorage automatically
            ajaxFunctions.getServerAPI(function () {
                var fetchedApi = localStorage.getItem("serverApi");
                fitnessTrackerGlobals.serverApi = JSON.parse(fetchedApi);
            });
        } else //else we return the parsed object as serverApi
        {
            return storedApi;
        }
    }();

    var privateHelperFunctions = function ()
    {
        function updateFriendlyArray(friendlyArrayToUpdate, unfriendlyArray, callback, removeUnselectedProperties)
        {
            var newValuesForFriendlyArray = jQuery.extend(true, [], unfriendlyArray);

            if (commonFunctions.isUndefinedOrNull(removeUnselectedProperties) || removeUnselectedProperties === true)
            {
                removeUnwantedProperties(newValuesForFriendlyArray, function ()
                {
                    deleteSecondaryFoodProperties(newValuesForFriendlyArray, function () {
                        /**
                         * empty the array this way so vue.js can track the changes
                         * as it can track pop() and push() methods
                         */
                        updateArray();
                    });
                });
            } else
            {
                updateArray();
            }

            function updateArray()
            {
                while (friendlyArrayToUpdate.length > 0)
                {
                    friendlyArrayToUpdate.pop();
                }
                for (var count = 0; count < newValuesForFriendlyArray.length; count++)
                {
                    friendlyArrayToUpdate.push(newValuesForFriendlyArray[count]);
                }
            }

            if (callback)
            {
                callback();
            }
        }



//        function updateSelectedFoodPropertiesFriendly()
//        {
//            var friendlySelectedFoodProperties = jQuery.extend(true, [], unfriendlySelectedFoodProperties);
//            var friendlyFoodProperties = globalValues.friendlyValues.friendlyFoodProperties;
//            for (var property in friendlySelectedFoodProperties.primaryFoodProperties)
//            {
//                if (friendlyFoodProperties.hasOwnProperty(property))
//                {
//                    friendlySelectedFoodProperties.primaryFoodProperties[friendlyFoodProperties[property]] = friendlySelectedFoodProperties.primaryFoodProperties[property];
//                    delete friendlySelectedFoodProperties.primaryFoodProperties[property];
//                }
//            }
//            for (var property in friendlySelectedFoodProperties.secondaryFoodProperties)
//            {
//                if (friendlyFoodProperties.hasOwnProperty(property))
//                {
//                    friendlySelectedFoodProperties.secondaryFoodProperties[friendlyFoodProperties[property]] = friendlySelectedFoodProperties.secondaryFoodProperties[property];
//                    delete friendlySelectedFoodProperties.secondaryFoodProperties[property];
//                }
//            }
//
//            if (callback)
//            {
//                callback();
//            }
//        }


//        function updateEatenFoodsArrayFriendly(callback)
//        {
//            var eatenFoodsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.eatenFoodsArray);
//
//            removeUnwantedProperties(eatenFoodsArrayDeepCopy, function ()
//            {
//                applyFriendlyProperties(eatenFoodsArrayDeepCopy, function ()
//                {
//                    deleteSecondaryFoodProperties(eatenFoodsArrayDeepCopy, function () {
//                        /**
//                         * empty the array this way so vue.js can track the changes
//                         * as it can track pop() and push() methods
//                         */
//                        while (globalValues.friendlyValues.eatenFoodsArrayFriendly.length > 0)
//                        {
//                            globalValues.friendlyValues.eatenFoodsArrayFriendly.pop();
//                        }
//                        for (var count = 0; count < eatenFoodsArrayDeepCopy.length; count++)
//                        {
//                            globalValues.friendlyValues.eatenFoodsArrayFriendly.push(eatenFoodsArrayDeepCopy[count]);
//                        }
//                    });
//                });
//            });
//
//            if (callback)
//            {
//                callback();
//            }
//        }
//
//        function updateCustomFoodsArrayFriendly(callback)
//        {
//            var customFoodsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.customFoodsArray);
//
//            removeUnwantedProperties(customFoodsArrayDeepCopy, function ()
//            {
//                applyFriendlyProperties(customFoodsArrayDeepCopy, function ()
//                {
//                    deleteSecondaryFoodProperties(customFoodsArrayDeepCopy, function () {
//                        /**
//                         * empty the array this way so vue.js can track the changes
//                         * as it can track pop() and push() methods
//                         */
//                        while (globalValues.friendlyValues.customFoodsArrayFriendly.length > 0)
//                        {
//                            globalValues.friendlyValues.customFoodsArrayFriendly.pop();
//                        }
//                        for (var count = 0; count < customFoodsArrayDeepCopy.length; count++)
//                        {
//                            globalValues.friendlyValues.customFoodsArrayFriendly.push(customFoodsArrayDeepCopy[count]);
//                        }
//                    });
//                });
//            });
//
//            if (callback)
//            {
//                callback();
//            }
//        }
//
//        function updateSearchResultsArrayFriendly(callback)
//        {
//            var searchResultsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.searchResultsArray);
//
//            removeUnwantedProperties(searchResultsArrayDeepCopy, function ()
//            {
//                applyFriendlyProperties(searchResultsArrayDeepCopy, function ()
//                {
//                    deleteSecondaryFoodProperties(searchResultsArrayDeepCopy, function () {
//                        /**
//                         * empty the array this way so vue.js can track the changes
//                         * as it can track pop() and push() methods
//                         */
//                        while (globalValues.friendlyValues.searchResultsArrayFriendly.length > 0)
//                        {
//                            globalValues.friendlyValues.searchResultsArrayFriendly.pop();
//                        }
//                        for (var count = 0; count < searchResultsArrayDeepCopy.length; count++)
//                        {
//                            globalValues.friendlyValues.searchResultsArrayFriendly.push(searchResultsArrayDeepCopy[count]);
//                        }
//                    });
//                });
//            });
//
//            if (callback)
//            {
//                callback();
//            }
//        }


        /**
         * Here we remove the primaryFoodProperties and secondaryFoodProperties the user
         * dosent want to see
         * note: descriptiveFoodProperties and identifierFoodProperties are NOT user modifiable
         * so we leave these untouched
         * 
         * @param {type} inputArray
         * @param {type} callback
         * @returns {undefined}
         */
        function removeUnwantedProperties(inputArray, callback)
        {
            //for every food in the array
            for (var index = 0; index < inputArray.length; index++)
            {
                var currentFood = inputArray[index];
                
                //for every subcategory of the food
                for (var subcategory in currentFood)
                {
                    var isNonOperableSubcategory = (subcategory === "descriptiveFoodProperties" || subcategory === "identifierFoodProperties");

                    if (!isNonOperableSubcategory)
                    {
                        //for every property of the subcategory
                        for (var property in currentFood[subcategory])
                        {
                            if (!fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[property])
                            {
                                delete currentFood[subcategory][property];
                            }
                        }
                    }
                }

//                for (var primaryProperty in currentFood.primaryFoodProperties)
//                {
//
//                    if(!fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[primaryProperty])
//                    {
//                        delete currentFood.primaryFoodProperties[primaryProperty];
//                    }
////                    if (jQuery.inArray(primaryProperty, selectedFoodPropertiesArray) === -1)
////                    {
////                        delete currentFood.primaryFoodProperties[primaryProperty];
////                    }
//                }
//
//                for (var secondaryProperty in currentFood.secondaryFoodProperties)
//                {
//                    if(!fitnessTrackerGlobals.globalValues.userValues.selectedFoodProperties[secondaryProperty])
//                    {
//                        delete currentFood.secondaryFoodProperties[secondaryProperty];
//                    }
//                    
//                    
////                    if (jQuery.inArray(secondaryProperty, selectedFoodPropertiesArray) === -1)
////                    {
////                        delete currentFood.secondaryFoodProperties[secondaryProperty];
////                    }
//                }
            }
            if (callback) {
                callback();
            }
        }


//        function applyFriendlyProperties(inputArray, callback)
//        {
//            /**
//             * Friendly values are applied to the primary and seconday property names
//             * e.g 
//             * "satfod" becomes "Saturated fats"
//             * "monofod" becomes "Monounsaturated fats" 
//             * "calorie" becomes "Calories"
//             */
//            var friendlyFoodProperties = globalValues.friendlyValues.friendlyFoodProperties;
//            for (var index = 0; index < inputArray.length; index++)
//            {
//                var currentFood = inputArray[index];
//
//                for (var unfriendlyProperty in currentFood.primaryFoodProperties)
//                {
//                    if (friendlyFoodProperties.hasOwnProperty(unfriendlyProperty))
//                    {
//                        var friendlyAttribute = friendlyFoodProperties[unfriendlyProperty];
//                        var unfriendlyPropertyValue = currentFood.primaryFoodProperties[unfriendlyProperty];
//
//                        currentFood.primaryFoodProperties[friendlyAttribute] = unfriendlyPropertyValue;
//                        delete currentFood.primaryFoodProperties[unfriendlyProperty];
//                    }
//                }
//
//                for (var unfriendlyProperty in currentFood.secondaryFoodProperties)
//                {
//                    if (friendlyFoodProperties.hasOwnProperty(unfriendlyProperty))
//                    {
//                        var friendlyAttribute = friendlyFoodProperties[unfriendlyProperty];
//                        var unfriendlyPropertyValue = currentFood.secondaryFoodProperties[unfriendlyProperty];
//
//                        currentFood.secondaryFoodProperties[friendlyAttribute] = unfriendlyPropertyValue;
//                        delete currentFood.secondaryFoodProperties[unfriendlyProperty];
//                    }
//                }
//            }
//            if (callback) {
//                callback();
//            }
//        }

        /**
         * Delete secondaryFoodProperties object for each food if there are none to display
         * @param {type} inputArray
         * @param {type} callback
         * @returns {undefined}
         */
        function deleteSecondaryFoodProperties(inputArray, callback)
        {
            for (var index = 0; index < inputArray.length; index++)
            {
                var currentFood = inputArray[index];

                if (jQuery.isEmptyObject(currentFood.secondaryFoodProperties))
                {
                    delete currentFood.secondaryFoodProperties;
                }
            }
            if (callback)
            {
                callback();
            }
        }

        //privateHelperFunctions
        return{
//            updateEatenFoodsArrayFriendly: updateEatenFoodsArrayFriendly,
//            updateCustomFoodsArrayFriendly: updateCustomFoodsArrayFriendly,
//            updateSearchResultsArrayFriendly: updateSearchResultsArrayFriendly,
            updateFriendlyArray: updateFriendlyArray
                    //updateSelectedFoodPropertiesFriendly: updateSelectedFoodPropertiesFriendly

        };
    }();

    //fitnessTrackerGlobals
    return{
        ajaxFunctions: ajaxFunctions,
        commonFunctions: commonFunctions,
        setGlobalValues: setGlobalValues,
        globalValues: globalValues,
        serverApi: serverApi
    };
}(); // end of globalNamespace


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

