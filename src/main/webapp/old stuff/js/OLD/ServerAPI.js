/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//parameters
var port = 8080;
var projectName = "fitness_tracker_servlet_maven";
var mainURL = "http://localhost:"+ port + "/" + projectName + "/";

//Server API
var URLLoginPage = "index.html";

//FrontController
var frontController = "/fitness_tracker_servlet_maven/FrontControllerServlet/";


//action requests
var loginRequest = "login";
var logoutRequest = "logout";
var createAccountRequest = "createAccount";
var testDatabase = "testDatabase";

//page requests
var customFoodsPageRequest = "customFoodsPage";
var mainPageRequest = "mainPage";
var workoutLogPageRequest = "workoutLogPage";
var sessionPlaceholderPageRequest = "sessionPlaceholderPage";
var loginPageRequest = "loginPage";
var createAccountPageRequest = "createAccountPage";
var myStatsPageRequest = "myStatsPage";

//AJAX requests
var AJAX_GetCustomFoodList = "AJAX_GetCustomFoodList";
var AJAX_GetEatenFoodList = "AJAX_GetEatenFoodList";
var AJAX_RemoveCustomFood = "AJAX_RemoveCustomFood";
var AJAX_AddCustomFood = "AJAX_AddCustomFood";
var AJAX_EditCustomFood = "AJAX_EditCustomFood";
var AJAX_AddEatenFood = "AJAX_AddEatenFood";
var AJAX_RemoveEatenFood = "AJAX_RemoveEatenFood";
var AJAX_SearchForFood = "AJAX_SearchForFood";
var AJAX_ModifySelectedAttributes = "AJAX_ModifySelectedAttributes";
var AJAX_GetSelectedAttributesList = "AJAX_GetSelectedAttributesList";
var AJAX_GetFriendlyNames = "AJAX_GetFriendlyNames";
var AJAX_ModifyUserStats = "AJAX_ModifyUserStats";
var AJAX_GetUserStats = "AJAX_GetUserStats";