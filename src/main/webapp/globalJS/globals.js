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
var fitnessTrackerGlobals = function () {

    var ajaxFunctions = function () {

        function getUserStats(callback)
        {
            console.log("getUserStats()");
            $.ajax({
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
            $.ajax({
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
            $.ajax({
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
            $.ajax({
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
        function getFoodAttributes(callback)
        {
            console.log("getFoodAttributes()");
            $.ajax({
                url: serverApi.requests.GET_VIEWABLE_ATTRIBUTES,
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
        function updateSelectedAttributes(newFoodAttributes, callback)
        {
            console.log("updateSelectedAttributes()");
            $.ajax({
                url: serverApi.requests.MODIFY_SELECTED_ATTRIBUTES,
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
                        document.getElementById("attributeFeedback").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" + serverApi.errorCodes[returnObject.errorCode] + ", no action taken</div>";
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
        /**
         *  This method is currently redundant however it has been left in as an 
         *  optional way to redirect the user to another page via an Ajax request.
         * @param {type} URL
         * @returns {undefined}
         */
        function makeRedirectRequestAjax(URL)
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
        }
        function logout()
        {
            $.ajax({
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
            $.ajax({
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
                        setGlobalValues.setSelectedFoodAttributes(returnObject.data.selectedFoodAttributes, function () {
                            setGlobalValues.setFriendlyNames(returnObject.data.friendlyNames, function () {
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
            $.ajax({
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
            getFoodAttributes: getFoodAttributes,
            updateSelectedAttributes: updateSelectedAttributes,
            makeRedirectRequestAjax: makeRedirectRequestAjax,
            logout: logout,
            getAllClientData: getAllClientData,
            getServerAPI: getServerAPI
        };
    }();
    var commonFunctions = function () {

        function createFriendlyFood(unfriendlyFoodObject)
        {
            var friendlyFood = jQuery.extend(true, {}, unfriendlyFoodObject);
            var friendlyFoodAttributes = globalValues.friendlyValues.friendlyFoodAttributes;
            friendlyFood = removeUnselectedAttributes(friendlyFood); 

            for (var unfriendlyAttribute in friendlyFood.primaryFoodAttributes)
            {
                if (friendlyFoodAttributes.hasOwnProperty(unfriendlyAttribute))
                {
                    var friendlyAttribute = friendlyFoodAttributes[unfriendlyAttribute];
                    var unfriendlyAttributeValue = friendlyFood.primaryFoodAttributes[unfriendlyAttribute];

                    friendlyFood.primaryFoodAttributes[friendlyAttribute] = unfriendlyAttributeValue;
                    delete friendlyFood.primaryFoodAttributes[unfriendlyAttribute];
                }
            }

            for (var unfriendlyAttribute in friendlyFood.secondaryFoodAttributes)
            {
                if (friendlyFoodAttributes.hasOwnProperty(unfriendlyAttribute))
                {
                    var friendlyAttribute = friendlyFoodAttributes[unfriendlyAttribute];
                    var unfriendlyAttributeValue = friendlyFood.secondaryFoodAttributes[unfriendlyAttribute];

                    friendlyFood.secondaryFoodAttributes[friendlyAttribute] = unfriendlyAttributeValue;
                    delete friendlyFood.secondaryFoodAttributes[unfriendlyAttribute];
                }
            }
            
            return friendlyFood;
        }

        function removeUnselectedAttributes(foodObject)
        {
            var outputFood = jQuery.extend(true, {}, foodObject);
            var selectedAttributeArray = commonFunctions.getSelectedAttributes();

            /**
             * Here we remove the primaryFoodAttributes and secondaryFoodAttributes the user
             * dosent want to see
             * note: descriptiveFoodAttributes and identifierFoodAttributes are NOT user modifiable
             * so we leave these untouched
             */

            for (var primaryAttribute in outputFood.primaryFoodAttributes)
            {
                //if primaryAttribute is NOT one of the users selected attributes and it is NOT the weight attribute, delete it
                if ($.inArray(primaryAttribute, selectedAttributeArray) === -1)// && !isWeightAttribute)
                {
                    delete outputFood.primaryFoodAttributes[primaryAttribute];
                }
            }

            for (var secondaryAttribute in outputFood.secondaryFoodAttributes)
            {
                if ($.inArray(secondaryAttribute, selectedAttributeArray) === -1)
                {
                    delete outputFood.secondaryFoodAttributes[secondaryAttribute];
                }
            }
            return outputFood;
        }

        function findFoodIndexByUuid(anArray, inputUuid)
        {
            function findFood(element, index, array) {

                if (element.identifierFoodAttributes.foodUuid === inputUuid)
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
         * Takes a food object that does not subcategorize its properties into
         * primaryFoodAttributes/secondaryFoodAttributes etc and categorizes them accordingly.
         * 
         * It does not modify the original object, but creates and returns a new formatted food object.
         * 
         * This method is used when the user enters a food manually but is available for use elsewhere if needed.
         * @param {type} unformattedFoodObject
         * @returns {Object}
         */
        function formatFoodObject(unformattedFoodObject)
        {
            var formattedFoodObject = jQuery.extend(true, {}, serverApi.standardFoodObject);

            for (var unformattedFoodProperty in unformattedFoodObject)
            {
                for (var subCategory in formattedFoodObject)
                {
                    if (formattedFoodObject[subCategory].hasOwnProperty(unformattedFoodProperty))
                    {
                        formattedFoodObject[subCategory][unformattedFoodProperty] = unformattedFoodObject[unformattedFoodProperty];
                    }
                }
            }
            return formattedFoodObject;
        }

        function showSelectedAttributes(callback)
        {
            var selectedFoodAttributesRef = globalValues.userValues.selectedFoodAttributes;
            console.log("showSelectedAttributes(): current selected attributes " + JSON.stringify(selectedFoodAttributesRef));
            //clear form
            document.getElementById("editSelectedAttributesForm").reset();
            for (var currentProperty in selectedFoodAttributesRef)
            {
                var currentElementName = currentProperty.toString();
                currentElementName = currentElementName + "checkbox";
                var currentElement = document.getElementById(currentElementName);
                if (currentElement !== null)
                {
                    if (selectedFoodAttributesRef[currentProperty] === true)
                    {
                        currentElement.checked = true;
                    }
                }
            }

            if (callback)
            {
                callback();
            }
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
        function createFoodAttributesHTML(foodUuid) //food ID is "id_searchablefood" or "id_customfood" etc, it defines the category of food object to look for
        {
            var outputHTML = "";
            var selectedAttributeArray = commonFunctions.getSelectedAttributes();
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
                if (commonFunctions.isUndefinedOrNull(currentAttributeValue))
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
                if (commonFunctions.isUndefinedOrNull(currentAttributeValue))
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
        }

        function getSelectedAttributes()
        {
            var selectedFoodAttributesRef = globalValues.userValues.selectedFoodAttributes;
            var outputArray = [];
            for (var aProperty in selectedFoodAttributesRef)
            {
                if (selectedFoodAttributesRef[aProperty] === true)
                {
                    outputArray.push(aProperty);
                }
            }
            outputArray.sort();
            return outputArray;
        }

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
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
                $(document).on("click", "#logout", function () {
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

        return{
            formatFoodObject: formatFoodObject,
            createFriendlyFood: createFriendlyFood,
            removeUnselectedAttributes:removeUnselectedAttributes,
            findFoodIndexByUuid: findFoodIndexByUuid,
            showSelectedAttributes: showSelectedAttributes,
            //refreshGlobalValuesFromLocalStorage: refreshGlobalValuesFromLocalStorage,
            setGlobalValuesLocalStorage: setGlobalValuesLocalStorage,
            //removeCharacters: removeCharacters,
            createFoodAttributesHTML: createFoodAttributesHTML,
            getSelectedAttributes: getSelectedAttributes,
            isUndefinedOrNull: isUndefinedOrNull,
            getURLParameter: getURLParameter,
            convertFormArrayToJSON: convertFormArrayToJSON,
            setupNavbar: setupNavbar,
            getUnixDate: getUnixDate,
            setCurrentlyViewedDate: setCurrentlyViewedDate,
            getCurrentlyViewedDate: getCurrentlyViewedDate
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

            selectedFoodAttributes: {}, //a single object containing ALL supported food attributes and defines if the user wants to see a particular attribute 
            //e.g {"protein":"t","fat":"f"} if the user wants to see protein content but not fat

            totalMacrosToday: {}, //the total of all food attributes of the eaten foods e.g total protein today, total fat today etc

        };
        /**
         * Here userValues modified with friendly values for displaying are stored, these are what should be shown to the user
         * They contain property names like "Saturated Fats" instead of "satfod" etc.
         */

        var miscValues = {
            nonOperableAttributes: ["foodcode", "foodname", "foodnameoriginal", "description",
                "foodgroup", "previous", "foodreferences", "footnote", "id_user", "id_eatenfood", "id_searchablefood", "timestamp"], //attributes that should not be operated on mathematically
            wholeIntegerAttributes: ["calorie", "kj", "weight"], //attributes that are whole integers as opposed to floats

            //these values are used by the passwordStrength.js and emailValid.js to validate a password and check if two emails match.
            passwordValid: false,
            emailValid: false
        };
        var friendlyValues = {
            friendlyFoodAttributes: {}, //friendly names for the food attributes e.g {"satfod":"Saturated fat","totsug":"Total Sugar"}
            eatenFoodsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
            customFoodsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
            searchResultsArrayFriendly: [], //DO NOT REPLACE THIS OBJECT, vue.js watches this object
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
            privateHelperFunctions.updateCustomFoodsArrayFriendly(function ()
            {
                commonFunctions.setGlobalValuesLocalStorage();
            });
            if (callback) {
                callback();
            }
        }
        function setEatenFoodsArray(eatenFoods, callback) {

            globalValues.userValues.eatenFoodsArray = eatenFoods;
            privateHelperFunctions.updateEatenFoodsArrayFriendly(function ()
            {
                commonFunctions.setGlobalValuesLocalStorage();
            });

            if (callback) {
                callback();
            }
        }
        function setSearchResultsArray(searchResults, callback) {
            globalValues.userValues.searchResultsArray = searchResults;
            globalValues.tempValues.tempSearchResultsArray = searchResults.slice(); //duplicate array

            privateHelperFunctions.updateSearchResultsArrayFriendly(function ()
            {
                commonFunctions.setGlobalValuesLocalStorage();
            });
            if (callback) {
                callback();
            }
        }
        function setSelectedFoodAttributes(inputFoodAttributes, callback) {
            globalValues.userValues.selectedFoodAttributes = inputFoodAttributes;
            commonFunctions.setGlobalValuesLocalStorage();
            if (callback) {
                callback();
            }
        }
        function setFriendlyNames(friendlyNames, callback) {
            globalValues.friendlyValues.friendlyFoodAttributes = friendlyNames;
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
        function setWholeIntegerAttributes(wholeIntegerAttributes, callback) {
            globalValues.miscValues.wholeIntegerAttributes = wholeIntegerAttributes;
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
            setSelectedFoodAttributes: setSelectedFoodAttributes,
            setFriendlyNames: setFriendlyNames,
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
        function updateEatenFoodsArrayFriendly(callback)
        {
            var eatenFoodsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.eatenFoodsArray);

            removeUnwantedAttributes(eatenFoodsArrayDeepCopy, function ()
            {
                applyFriendlyValues(eatenFoodsArrayDeepCopy, function ()
                {
                    deleteSecondaryFoodAttributes(eatenFoodsArrayDeepCopy, function () {
                        /**
                         * empty the array this way so vue.js can track the changes
                         * as it can track pop() and push() methods
                         */
                        while (globalValues.friendlyValues.eatenFoodsArrayFriendly.length > 0)
                        {
                            globalValues.friendlyValues.eatenFoodsArrayFriendly.pop();
                        }
                        for (var count = 0; count < eatenFoodsArrayDeepCopy.length; count++)
                        {
                            globalValues.friendlyValues.eatenFoodsArrayFriendly.push(eatenFoodsArrayDeepCopy[count]);
                        }
                    });
                });
            });

            if (callback)
            {
                callback();
            }
        }

        function updateCustomFoodsArrayFriendly(callback)
        {
            var customFoodsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.customFoodsArray);

            removeUnwantedAttributes(customFoodsArrayDeepCopy, function ()
            {
                applyFriendlyValues(customFoodsArrayDeepCopy, function ()
                {
                    deleteSecondaryFoodAttributes(customFoodsArrayDeepCopy, function () {
                        /**
                         * empty the array this way so vue.js can track the changes
                         * as it can track pop() and push() methods
                         */
                        while (globalValues.friendlyValues.customFoodsArrayFriendly.length > 0)
                        {
                            globalValues.friendlyValues.customFoodsArrayFriendly.pop();
                        }
                        for (var count = 0; count < customFoodsArrayDeepCopy.length; count++)
                        {
                            globalValues.friendlyValues.customFoodsArrayFriendly.push(customFoodsArrayDeepCopy[count]);
                        }
                    });
                });
            });

            if (callback)
            {
                callback();
            }
        }

        function updateSearchResultsArrayFriendly(callback)
        {
            var searchResultsArrayDeepCopy = jQuery.extend(true, [], globalValues.userValues.searchResultsArray);

            removeUnwantedAttributes(searchResultsArrayDeepCopy, function ()
            {
                applyFriendlyValues(searchResultsArrayDeepCopy, function ()
                {
                    deleteSecondaryFoodAttributes(searchResultsArrayDeepCopy, function () {
                        /**
                         * empty the array this way so vue.js can track the changes
                         * as it can track pop() and push() methods
                         */
                        while (globalValues.friendlyValues.searchResultsArrayFriendly.length > 0)
                        {
                            globalValues.friendlyValues.searchResultsArrayFriendly.pop();
                        }
                        for (var count = 0; count < searchResultsArrayDeepCopy.length; count++)
                        {
                            globalValues.friendlyValues.searchResultsArrayFriendly.push(searchResultsArrayDeepCopy[count]);
                        }
                    });
                });
            });

            if (callback)
            {
                callback();
            }
        }

        function removeUnwantedAttributes(inputArray, callback)
        {
            /**
             * Here we remove the primaryFoodAttributes and secondaryFoodAttributes the user
             * dosent want to see
             * note: descriptiveFoodAttributes and identifierFoodAttributes are NOT user modifiable
             * so we leave these untouched
             */
            var selectedAttributeArray = commonFunctions.getSelectedAttributes();
            for (var index = 0; index < inputArray.length; index++)
            {
                var currentFood = inputArray[index];

                for (var primaryAttribute in currentFood.primaryFoodAttributes)
                {
//                    var isWeightAttribute = (primaryAttribute === "weight");
//                    if (isSearchResult && isWeightAttribute)
//                    {
//                        //we convert weight from a string to a number for use in the html5 input element with type "number"
//                        currentFood.primaryFoodAttributes[primaryAttribute] = parseInt(currentFood.primaryFoodAttributes[primaryAttribute]);
//                    }

                    //if primaryAttribute is NOT one of the users selected attributes and it is NOT the weight attribute, delete it
                    if ($.inArray(primaryAttribute, selectedAttributeArray) === -1)// && !isWeightAttribute)
                    {
                        delete currentFood.primaryFoodAttributes[primaryAttribute];
                    }
                }

                for (var secondaryAttribute in currentFood.secondaryFoodAttributes)
                {
                    if ($.inArray(secondaryAttribute, selectedAttributeArray) === -1)
                    {
                        delete currentFood.secondaryFoodAttributes[secondaryAttribute];
                    }
                }
            }
            if (callback) {
                callback();
            }
        }


        function applyFriendlyValues(inputArray, callback)
        {
            /**
             * Friendly values are applied to the primary and seconday attribute names
             * e.g 
             * "satfod" becomes "Saturated fats"
             * "monofod" becomes "Monounsaturated fats" 
             * "calorie" becomes "Calories"
             */
            var friendlyFoodAttributes = globalValues.friendlyValues.friendlyFoodAttributes;
            for (var index = 0; index < inputArray.length; index++)
            {
                var currentFood = inputArray[index];

                for (var unfriendlyAttribute in currentFood.primaryFoodAttributes)
                {
                    if (friendlyFoodAttributes.hasOwnProperty(unfriendlyAttribute))
                    {
                        var friendlyAttribute = friendlyFoodAttributes[unfriendlyAttribute];
                        var unfriendlyAttributeValue = currentFood.primaryFoodAttributes[unfriendlyAttribute];

                        currentFood.primaryFoodAttributes[friendlyAttribute] = unfriendlyAttributeValue;
                        delete currentFood.primaryFoodAttributes[unfriendlyAttribute];
                    }
                }

                for (var unfriendlyAttribute in currentFood.secondaryFoodAttributes)
                {
                    if (friendlyFoodAttributes.hasOwnProperty(unfriendlyAttribute))
                    {
                        var friendlyAttribute = friendlyFoodAttributes[unfriendlyAttribute];
                        var unfriendlyAttributeValue = currentFood.secondaryFoodAttributes[unfriendlyAttribute];

                        currentFood.secondaryFoodAttributes[friendlyAttribute] = unfriendlyAttributeValue;
                        delete currentFood.secondaryFoodAttributes[unfriendlyAttribute];
                    }
                }
            }
            if (callback) {
                callback();
            }
        }

        function deleteSecondaryFoodAttributes(inputArray, callback)
        {
            /**
             * Delete secondaryFoodAttributes object if there are none to display
             */
            for (var index = 0; index < inputArray.length; index++)
            {
                var currentFood = inputArray[index];

                if ($.isEmptyObject(currentFood.secondaryFoodAttributes))
                {
                    delete currentFood.secondaryFoodAttributes;
                }
            }
            if (callback)
            {
                callback();
            }
        }

        return{
            updateEatenFoodsArrayFriendly: updateEatenFoodsArrayFriendly,
            updateCustomFoodsArrayFriendly: updateCustomFoodsArrayFriendly,
            updateSearchResultsArrayFriendly: updateSearchResultsArrayFriendly
        };
    }();


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

