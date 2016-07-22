/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    globalFunctions.refreshGlobalValuesFromLocalStorage();
});
var globalValues = {
    userValues: {
        userStats: {}, //an object containing the users ideal protein/carb/fat/calorie consumption values, they set these up themselves
        customFoodsArray: [], //an array of objects which represent the current users custom foods
        eatenFoodsArray: [], //an array of objects which represent the current users eaten foods
        searchResultsArray: [], //an array of objects which represent the current users search results if they searched the database
        foodAttributes: {}, //a single object containing ALL supported food attributes and defines if the user wants to see a particular attribute 
        //e.g {"protein":"t","fat":"f"} if the user wants to see protein content but not fat
        totalMacrosToday: {} //the total of all food attributes of the eaten foods e.g total protein today, total fat today etc
    },
    miscValues: {
        nonOperableAttributes: ["foodcode", "foodname", "foodnameoriginal", "description",
            "foodgroup", "previous", "foodreferences", "footnote", "id_user", "id_eatenfood", "id_searchablefood", "timestamp"], //attributes that should not be operated on mathematically
        wholeIntegerAttributes: ["calorie", "kj", "weight"], //attributes that are whole integers as opposed to floats

        //these values are used by the passwordStrength.js and emailValid.js to validate a password and check if two emails match.
        passwordValid: false,
        emailValid: false,
    },
    friendlyValues: {
        friendlyFoodAttributes: {}, //friendly names for the food attributes e.g {"satfod":"Saturated fat","totsug":"Total Sugar"}
        errorCodeHints: {} //hints for the error codes
    },
    tempValues: {
        /**
         * These are stored seperately to avoid a situation where the user uses the calculator, clicks save
         * then manually enters their own stats, then decides they want to go back to the calcualtors values again
         * so they click save again, but it dosent work because the manual entry would have already overwritten the previously caluclated stats.
         * The user would have to click calculate again.
         */
        tempUserStatsManual: {}, //manually entered stats are stored here, if the user chooses to save them they become userValues.userStats
        tempUserStatsCalculated: {} //calculated stats are stored here, if the user chooses to save them they become userValues.userStats
    }

};
//not currently used but may be of use in the future!
//var errorCodes = {
//    "10":"Error 10: password too short",
//    "11":"Error 11: account with that email already exists",
//    "12":"Error 12: account dosent exist",
//    "13":"Error 13: change password request already used or expired",
//    "14":"Error 14: password change failed",
//    "15":"Error 15: account name or password incorrect",
//    "16":"Error 16: your password was incorrect",
//    "17":"Error 17: email change failed",
//    "18":"Error 18: update attributes failed",
//    "19":"Error 19: add custom food failed"
//
//};

/**
 * serverAPI which should look like the following:
 * 
 * {
 "serverAPI": {
 "errorCodes": {
 "10": "SAMPLE_ERROR1",
 "11": "SAMPLE_ERROR2",
 "12": "SAMPLE_ERROR3"
 
 },
 "requests": {
 "SAMPLE_REQUEST1": "/FrontControllerServlet/SAMPLE_REQUEST1",
 "SAMPLE_REQUEST2": "/FrontControllerServlet/SAMPLE_REQUEST2",
 "SAMPLE_REQUEST3": "/FrontControllerServlet/SAMPLE_REQUEST3"
 }
 }
 }
 * @type Array|Object
 */
var serverAPI = JSON.parse(localStorage.getItem("serverAPI"));
//    parameters: {
//        port: 8080,
//        projectName: "fitness_tracker_servlet_maven",
//        mainURL: "http://localhost:8080" // replace with "window.location.hostname" ??
//    },
//    requests: {
//        //action requests
//        loginRequest: "login",
//        logoutRequest: "logout",
//        createAccountRequest: "createAccount",
//        //frontController: "/fitness_tracker_servlet_maven/FrontControllerServlet/", //for when webapp is non ROOT
//        frontController: "FrontControllerServlet", //for when webapp is hosted as ROOT
//        //page requests
//        customFoodsPageRequest: "customFoodsPage",
//        mainPageRequest: "mainPage",
//        workoutLogPageRequest: "workoutLogPage",
//        sessionPlaceholderPageRequest: "sessionPlaceholderPage",
//        loginPageRequest: "loginPage",
//        createAccountPageRequest: "createAccountPage",
//        myStatsPageRequest: "myStatsPage",
//        forgotPasswordPageRequest: "forgotPasswordPage",
//        forgotPasswordEmailRequest: "forgotPasswordEmail",
//        changePasswordRequest: "changePassword",
//        changeEmailRequest: "changeEmail",
//        settingsPageRequest: "settingsPage",
//        deleteAccountRequest: "deleteAccount",
//        
//        //Ajax requests
//        Ajax_GetCustomFoodList: "Ajax_GetCustomFoodList",
//        Ajax_GetEatenFoodList: "Ajax_GetEatenFoodList",
//        Ajax_RemoveCustomFood: "Ajax_RemoveCustomFood",
//        Ajax_AddCustomFood: "Ajax_AddCustomFood",
//        Ajax_EditCustomFood: "Ajax_EditCustomFood",
//        Ajax_AddEatenFood: "Ajax_AddEatenFood",
//        Ajax_RemoveEatenFood: "Ajax_RemoveEatenFood",
//        Ajax_SearchForFood: "Ajax_SearchForFood",
//        Ajax_ModifySelectedAttributes: "Ajax_ModifySelectedAttributes",
//        Ajax_GetViewableAttributesList: "Ajax_GetViewableAttributesList",
//        Ajax_GetFriendlyNames: "Ajax_GetFriendlyNames",
//        Ajax_ModifyUserStats: "Ajax_ModifyUserStats",
//        Ajax_GetUserStats: "Ajax_GetUserStats",
//        Ajax_GetIdentifierTokenEmail:"Ajax_GetIdentifierTokenEmail"






//var customFoodsArray; //an array of JSON objects which represent the current users custom foods
//var eatenFoodsArray; //an array of JSON objects which represent the current users eaten foods
//var searchResultsArray; //an array js JSON objects which represent the current users search results if they searched the database
//var foodAttributes; //a single JSON object containing food attributes the user wants to see e.g protein,carbs,saturated fats
//var friendlyNames; //friendly names for the food attributes e.g {"satfod":"Saturated fat","totsug":"Total Sugar"}
//var totalMacrosToday;
//var currentMacroSplit;
//var macroGraph;
//var userStats = {};

//var nonOperableAttributes = ["foodcode", "foodname", "foodnameoriginal", "description",
//    "foodgroup", "previous", "foodreferences", "footnote", "id_user", "id_eatenfood", "id_searchablefood", "timestamp"];
//var wholeIntegerAttributes = ["calorie", "kj", "weight"];

//global viewDate object
//this is the date the user is currently viewing
//var viewDate;
//var eventTriggered = false;
