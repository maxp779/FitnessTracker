/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.globalvalues;

import com.fitnesstracker.serverAPI.Request;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class contains important values all in one location
 *
 * @author max
 */
public class GlobalValues
{

    private static final String FIRST_LOGIN_SERVLET = "LoginPageServlet";
    private static final String DOMAIN_NAME = "http://www.simplfitness.co.uk";

    //html page URL
    private static final String LOGIN_PAGE_URL = "/webPages/loginPage/loginPage.html";
    private static final String COOKIES_POLICY_URL = "/webPages/cookiesPolicyPage/cookiesPolicyPage.html";
    private static final String ABOUT_PAGE_URL = "/webPages/aboutPage/aboutPage.html";
    private static final String MACRO_LOG_PAGE_URL = "/webPages/macroLog/macroLog.html";
    private static final String FOOD_LOG_PAGE_URL = "/webPages/foodLog/foodLog.html";
    private static final String WORKOUT_LOG_PAGE_URL = "/webPages/workoutLogPage/workoutLogPage.html";
    private static final String SETTINGS_PAGE_URL = "/webPages/settingsPage/settingsPage.html";
    private static final String CREATE_ACCOUNT_PAGE_URL = "/webPages/createAccountPage/createAccountPage.html";
    private static final String CUSTOM_FOODS_PAGE_URL = "/webPages/customFoodsPage/customFoodsPage.html";
    private static final String MY_STATS_PAGE_URL = "/webPages/myStatsPage/myStatsPage.html";
    private static final String FORGOT_PASSWORD_PAGE_URL = "/webPages/forgotPasswordPage/forgotPasswordPage.html";
    private static final String CHANGE_PASSWORD_PAGE_URL = "/webPages/changePasswordPage/changePasswordPage.html";

    //html pages
    private static final String LOGIN_PAGE = "loginPage.html";
    private static final String COOKIES_POLICY = "cookiesPolicyPage.html";
    private static final String ABOUT_PAGE = "aboutPage.html";
    private static final String MACRO_LOG = "macroLog.html";
    private static final String FOOD_LOG = "foodLog.html";
    private static final String WORKOUT_LOG_PAGE = "workoutLogPage.html";
    private static final String SETTINGS_PAGE = "settingsPage.html";
    private static final String CREATE_ACCOUNT_PAGE = "createAccountPage.html";
    private static final String CUSTOM_FOODS_PAGE = "customFoodsPage.html";
    private static final String MY_STATS_PAGE = "myStatsPage.html";
    private static final String FORGOT_PASSWORD_PAGE = "forgotPasswordPage.html";
    private static final String CHANGE_PASSWORD_PAGE = "changePasswordPage.html";

    //misc values
    private static final int SESSION_TIMEOUT_VALUE = 21600; // session timeout, 0 or less will never timeout, this value is in seconds, currently 21600 is 6 hours    
    private static final int MIN_PASSWORD_LENGTH = 6;

    //database values
    private static final String DATABASE_URL = "jdbc:postgresql://localhost:5432/fitnessTrackerDatabase";
    private static final String DATABASE_CONNECTION_POOL = "jdbc/fitnessTrackerDB"; //JNDI name for connection pool

    //requests which require authentication i.e user needs to be logged in to do this stuff
    private static final String[] AUTH_RESOURCES =
    {
        Request.MACRO_LOG_PAGE_REQUEST.toString(),
        Request.FOOD_LOG_PAGE_REQUEST.toString(),
        Request.WORKOUT_LOG_PAGE_REQUEST.toString(),
        Request.CUSTOM_FOODS_PAGE_REQUEST.toString(),
        Request.MY_STATS_PAGE_REQUEST.toString(),
        Request.CHANGE_EMAIL_REQUEST.toString(),
        Request.SETTINGS_PAGE_REQUEST.toString(),
        Request.DELETE_ACCOUNT_REQUEST.toString(),
        Request.GET_CUSTOM_FOOD_LIST.toString(),
        Request.DELETE_CUSTOM_FOOD.toString(),
        Request.CREATE_CUSTOM_FOOD.toString(),
        Request.EDIT_CUSTOM_FOOD.toString(),
        Request.ADD_EATEN_FOOD.toString(),
        Request.GET_EATEN_FOOD_LIST.toString(),
        Request.REMOVE_EATEN_FOOD.toString(),
        Request.SEARCH_FOR_FOOD.toString(),
        Request.MODIFY_SELECTED_FOOD_PROPERTIES.toString(),
        Request.MODIFY_USER_STATS.toString(),
        Request.GET_USER_STATS.toString(),
        Request.GET_ALL_CLIENT_DATA.toString(),
        MACRO_LOG,
        WORKOUT_LOG_PAGE,
        SETTINGS_PAGE,
        CUSTOM_FOODS_PAGE,
        MY_STATS_PAGE
    };

    //user friendly values for the database column names
    private static final Map<String, String> FRIENDLY_PROPERTIES_MAP;

    static
    {
        FRIENDLY_PROPERTIES_MAP = new HashMap<>();
        FRIENDLY_PROPERTIES_MAP.put("foodname", "Food Name");
        FRIENDLY_PROPERTIES_MAP.put("foodnameoriginal", "Food Name");
        FRIENDLY_PROPERTIES_MAP.put("description", "Description");
        FRIENDLY_PROPERTIES_MAP.put("reference", "Main data reference");
        FRIENDLY_PROPERTIES_MAP.put("water", "Water (g)");
        FRIENDLY_PROPERTIES_MAP.put("totnit", "Total Nitrogen (g)");
        FRIENDLY_PROPERTIES_MAP.put("protein", "Protein (g)");
        FRIENDLY_PROPERTIES_MAP.put("fat", "Fat (g)");
        FRIENDLY_PROPERTIES_MAP.put("carbohydrate", "Carbohydrates (g)");
        FRIENDLY_PROPERTIES_MAP.put("calorie", "Calories (kcal)");
        FRIENDLY_PROPERTIES_MAP.put("kj", "Energy(kj)");
        FRIENDLY_PROPERTIES_MAP.put("star", "Starch (g)");
        FRIENDLY_PROPERTIES_MAP.put("oligo", "Oligosaccharide (g)");
        FRIENDLY_PROPERTIES_MAP.put("totsug", "Total Sugar (g)");
        FRIENDLY_PROPERTIES_MAP.put("gluc", "Glucose (g)");
        FRIENDLY_PROPERTIES_MAP.put("galact", "Galactose (g)");
        FRIENDLY_PROPERTIES_MAP.put("fruct", "Fructose (g)");
        FRIENDLY_PROPERTIES_MAP.put("sucr", "Sucrose (g)");
        FRIENDLY_PROPERTIES_MAP.put("malt", "Maltose (g)");
        FRIENDLY_PROPERTIES_MAP.put("lact", "Lactose (g)");
        FRIENDLY_PROPERTIES_MAP.put("alco", "Alcohol (g)");
        FRIENDLY_PROPERTIES_MAP.put("engfib", "Dietary Fibre (g)");
        FRIENDLY_PROPERTIES_MAP.put("aoacfib", "AOAC Fibre (g)");
        FRIENDLY_PROPERTIES_MAP.put("satfod", "Saturated fat (g)");
        FRIENDLY_PROPERTIES_MAP.put("monofod", "Monounsaturated fat (g)");
        FRIENDLY_PROPERTIES_MAP.put("polyfod", "Polyunsaturated fat (g)");
        FRIENDLY_PROPERTIES_MAP.put("totn6pfod", "Omega 6 (g)");
        FRIENDLY_PROPERTIES_MAP.put("totn3pfod", "Omega 3 (g)");
        FRIENDLY_PROPERTIES_MAP.put("fodtrans", "Trans fats (g)");
        FRIENDLY_PROPERTIES_MAP.put("chol", "Cholesterol(mg)");
        FRIENDLY_PROPERTIES_MAP.put("na", "Sodium (mg)");
        FRIENDLY_PROPERTIES_MAP.put("k", "Potassium (mg)");
        FRIENDLY_PROPERTIES_MAP.put("ca", "Calcium (mg)");
        FRIENDLY_PROPERTIES_MAP.put("mg", "Magnesium (mg)");
        FRIENDLY_PROPERTIES_MAP.put("p", "Phosphorus (mg)");
        FRIENDLY_PROPERTIES_MAP.put("fe", "Iron (mg)");
        FRIENDLY_PROPERTIES_MAP.put("cu", "Copper (mg)");
        FRIENDLY_PROPERTIES_MAP.put("zn", "Zinc (mg)");
        FRIENDLY_PROPERTIES_MAP.put("cl", "Chloride (mg)");
        FRIENDLY_PROPERTIES_MAP.put("mn", "Manganese (mg)");
        FRIENDLY_PROPERTIES_MAP.put("se", "Selenium (µg)");
        FRIENDLY_PROPERTIES_MAP.put("i", "Iodine (µg)");
        FRIENDLY_PROPERTIES_MAP.put("ret", "Retinol (µg)");
        FRIENDLY_PROPERTIES_MAP.put("carequ", "Carotene (µg)");
        FRIENDLY_PROPERTIES_MAP.put("retequ", "Vitamin A (µg)");
        FRIENDLY_PROPERTIES_MAP.put("vitd", "Vitamin D (µg)");
        FRIENDLY_PROPERTIES_MAP.put("vite", "Vitamin E (µg)");
        FRIENDLY_PROPERTIES_MAP.put("vitk1", "Vitamin K1 (Phylloquinone) (µg)");
        FRIENDLY_PROPERTIES_MAP.put("thia", "Thiamin (mg)");
        FRIENDLY_PROPERTIES_MAP.put("ribo", "Riboflavin (mg)");
        FRIENDLY_PROPERTIES_MAP.put("niac", "Niacin (mg)");
        FRIENDLY_PROPERTIES_MAP.put("niacequ", "Vitamin B3 (mg)");
        FRIENDLY_PROPERTIES_MAP.put("vitb6", "Vitamin B6 (mg)");
        FRIENDLY_PROPERTIES_MAP.put("folt", "Folic acid (µg)");
        FRIENDLY_PROPERTIES_MAP.put("panto", "Vitamin B5 (Pantothenate) (mg)");
        FRIENDLY_PROPERTIES_MAP.put("biot", "Vitamin B7 (Biotin) (µg)");
        FRIENDLY_PROPERTIES_MAP.put("vitc", "Vitamin C (mg)");
        FRIENDLY_PROPERTIES_MAP.put("weight", "Weight (g)");
    }

    private static final List<String> SUPPORTED_FOOD_PROPERTIES = (Arrays.asList("foodname", "description", "foodreferences", "water", "totnit", "protein", "fat",
            "carbohydrate", "calorie", "kj", "star", "oligo", "totsug", "gluc", "galact", "fruct", "sucr", "malt", "lact", "alco", "engfib", "aoacfib", "satfod",
            "monofod", "polyfod", "totn6pfod", "totn3pfod", "fodtrans", "chol", "na", "k", "ca", "mg", "p", "fe", "cu", "zn", "cl", "mn", "se", "i", "ret", "carequ",
            "retequ", "vitd", "vite", "vitk1", "thia", "ribo", "niac", "niacequ", "vitb6", "folt", "panto", "biot", "vitc", "weight"));

    private static final List<String> PRIMARY_FOOD_PROPERTIES = (Arrays.asList("protein", "carbohydrate", "fat", "calorie", "weight"));

    private static final List<String> SECONDARY_FOOD_PROPERTIES = (Arrays.asList("water", "totnit",
            "kj", "star", "oligo", "totsug", "gluc", "galact", "fruct", "sucr", "malt", "lact", "alco", "engfib", "aoacfib", "satfod",
            "monofod", "polyfod", "totn6pfod", "totn3pfod", "fodtrans", "chol"));
    private static final List<String> VITAMINS = (Arrays.asList("na", "k", "ca", "mg", "p", "fe", "cu", "zn", "cl", "mn", "se", "i"));          
    private static final List<String> MINERALS = (Arrays.asList("ret", "carequ", "retequ", "vitd", "vite", "vitk1", "thia", "ribo", "niac", "niacequ", "vitb6", "folt", "panto", "biot", "vitc"));
    private static final List<String> DESCRIPTIVE_FOOD_PROPERTIES = (Arrays.asList("foodname", "foodnameoriginal", "description", "foodreferences", "footnote"));
    private static final List<String> IDENTIFIER_FOOD_PROPERTIES = (Arrays.asList("userId", "foodUuid", "unixTime"));

    private static final List<String> NON_MATHEMATICALLY_OPERABLE_PROPERTIES = (Arrays.asList("foodname", "foodnameoriginal", "description", "foodreferences", "footnote","userId", "foodUuid", "unixTime"));
    private static final List<String> WHOLE_INTEGER_PROPERTIES = (Arrays.asList("calorie", "kj", "weight", "user_id", "na", "k", "ca", "mg", "p",
            "cl", "se", "i", "ret", "carequ", "retequ", "folt", "vitc"));
    
    private static final List<String> VARCHAR_PROPERTIES = (Arrays.asList("foodname", "foodnameoriginal", "description", "foodreferences", "footnote", "foodUuid", "unixTime"));
    
    private static final List<String> SUPPORTED_USER_STATS = (Arrays.asList("weight", "height", "proteinGoal", "carbohydrateGoal", "fatGoal", "tee", "teeGoal", "dateOfBirth",
            "gender", "activityLevel", "excerciseIntensity", "excerciseDaysPerWeek", "excerciseMinutesPerDay"));

    public static List<String> getVARCHAR_PROPERTIES()
    {
        return VARCHAR_PROPERTIES;
    }
    
    public static List<String> getNON_MATHEMATICALLY_OPERABLE_PROPERTIES()
    {
        return NON_MATHEMATICALLY_OPERABLE_PROPERTIES;
    }

    public static List<String> getVITAMINS()
    {
        return VITAMINS;
    }

    public static List<String> getMINERALS()
    {
        return MINERALS;
    }

    public static String getFOOD_LOG()
    {
        return FOOD_LOG;
    }

    public static List<String> getPRIMARY_FOOD_PROPERTIES()
    {
        return PRIMARY_FOOD_PROPERTIES;
    }

    public static List<String> getSECONDARY_FOOD_PROPERTIES()
    {
        return SECONDARY_FOOD_PROPERTIES;
    }

    public static List<String> getDESCRIPTIVE_FOOD_PROPERTIES()
    {
        return DESCRIPTIVE_FOOD_PROPERTIES;
    }

    public static List<String> getIDENTIFIER_FOOD_PROPERTIES()
    {
        return IDENTIFIER_FOOD_PROPERTIES;
    }

    public static String getFOOD_LOG_PAGE_URL()
    {
        return FOOD_LOG_PAGE_URL;
    }

    public static String getDOMAIN_NAME()
    {
        return DOMAIN_NAME;
    }

    public static List<String> getSUPPORTED_FOOD_PROPERTIES()
    {
        return SUPPORTED_FOOD_PROPERTIES;
    }

    public static List<String> getWHOLE_INTEGER_PROPERTIES()
    {
        return WHOLE_INTEGER_PROPERTIES;
    }

    public static List<String> getSUPPORTED_USER_STATS()
    {
        return SUPPORTED_USER_STATS;
    }

    public static int getMIN_PASSWORD_LENGTH()
    {
        return MIN_PASSWORD_LENGTH;
    }

    public static String[] getAUTH_RESOURCES()
    {
        return AUTH_RESOURCES;
    }

    public static String getSETTINGS_PAGE()
    {
        return SETTINGS_PAGE;
    }

    public static String getFORGOT_PASSWORD_PAGE()
    {
        return FORGOT_PASSWORD_PAGE;
    }

    public static String getCHANGE_PASSWORD_PAGE()
    {
        return CHANGE_PASSWORD_PAGE;
    }

    public static String getMY_STATS_PAGE()
    {
        return MY_STATS_PAGE;
    }

    public static String getCUSTOM_FOODS_PAGE()
    {
        return CUSTOM_FOODS_PAGE;
    }

    public static String getWORKOUT_LOG_PAGE()
    {
        return WORKOUT_LOG_PAGE;
    }

    public static String getDATABASE_CONNECTION_POOL()
    {
        return DATABASE_CONNECTION_POOL;
    }

    public static String getCOOKIES_POLICY()
    {
        return COOKIES_POLICY;
    }

    public static String getABOUT_PAGE()
    {
        return ABOUT_PAGE;
    }

    public static String getCREATE_ACCOUNT_PAGE()
    {
        return CREATE_ACCOUNT_PAGE;
    }

    public static String getDATABASE_URL()
    {
        return DATABASE_URL;
    }

    /**
     * returns the amount of time in seconds that a cookie based session is
     * valid for, a value of 0 or less means the session will never expire on
     * its own
     *
     * @return
     */
    public static int getSESSION_TIMEOUT_VALUE()
    {
        return SESSION_TIMEOUT_VALUE;
    }

    public static String getLOGIN_PAGE()
    {
        return LOGIN_PAGE;
    }

    public static String getMACRO_LOG()
    {
        return MACRO_LOG;
    }

    public static Map<String, String> getFRIENDLY_PROPERTIES_MAP()
    {
        return FRIENDLY_PROPERTIES_MAP;
    }

    public static String getLOGIN_PAGE_URL()
    {
        return LOGIN_PAGE_URL;
    }

    public static String getCOOKIES_POLICY_URL()
    {
        return COOKIES_POLICY_URL;
    }

    public static String getABOUT_PAGE_URL()
    {
        return ABOUT_PAGE_URL;
    }

    public static String getMACRO_LOG_PAGE_URL()
    {
        return MACRO_LOG_PAGE_URL;
    }

    public static String getWORKOUT_LOG_PAGE_URL()
    {
        return WORKOUT_LOG_PAGE_URL;
    }

    public static String getSETTINGS_PAGE_URL()
    {
        return SETTINGS_PAGE_URL;
    }

    public static String getCREATE_ACCOUNT_PAGE_URL()
    {
        return CREATE_ACCOUNT_PAGE_URL;
    }

    public static String getCUSTOM_FOODS_PAGE_URL()
    {
        return CUSTOM_FOODS_PAGE_URL;
    }

    public static String getMY_STATS_PAGE_URL()
    {
        return MY_STATS_PAGE_URL;
    }

    public static String getFORGOT_PASSWORD_PAGE_URL()
    {
        return FORGOT_PASSWORD_PAGE_URL;
    }

    public static String getCHANGE_PASSWORD_PAGE_URL()
    {
        return CHANGE_PASSWORD_PAGE_URL;
    }

    public static String getFIRST_LOGIN_SERVLET()
    {
        return FIRST_LOGIN_SERVLET;
    }

}
