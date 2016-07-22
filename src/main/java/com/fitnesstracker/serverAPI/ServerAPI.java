/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.serverAPI;

import com.fitnesstracker.core.FrontControllerServlet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * This class contains the commands the client will send to FrontController, e.g
 * "FrontController/desktopMainPage" these are kept separate from
 * GlobalVariables to avoid confusion
 *
 * @author max
 */
public class ServerAPI
{

    private static EnumSet<Request> requestEnumSet = EnumSet.allOf(Request.class);
    private static EnumSet<ErrorCode> errorCodesEnumSet = EnumSet.allOf(ErrorCode.class);

    //private static Map<Requests, String> REQUESTS_API_MAP;
    private static List<Request> REQUESTS_API_LIST;
    private static Map<String, String> REQUESTS_API_MAP_STRING;
    private static Map<ErrorCode, Integer> ERROR_CODES_MAP;
    private static Map<String, String> ERROR_CODES_MAP_STRING;
    private static final String FRONT_CONTROLLER_NAME = FrontControllerServlet.class.getSimpleName();

    public static void setupServerAPI()
    {
        REQUESTS_API_LIST = setupREQUESTS_API_LIST();
        REQUESTS_API_MAP_STRING = setupREQUESTS_API_MAP_STRING(REQUESTS_API_LIST);
        ERROR_CODES_MAP = setupERROR_CODES_MAP();
        ERROR_CODES_MAP_STRING = setupERROR_CODES_MAP_STRING(ERROR_CODES_MAP);
    }

    private static List<Request> setupREQUESTS_API_LIST()
    {
        List<Request> outputList = new ArrayList<>();
        Iterator iterator = requestEnumSet.iterator();
        while (iterator.hasNext())
        {
            outputList.add((Request) iterator.next());
        }

//        outputMap.put(Request.FRONTCONTROLLER, "FrontControllerServlet");
//        outputMap.put(Request.LOGIN_REQUEST, Request.LOGIN_REQUEST.toString());
//        outputMap.put(Request.LOGOUT_REQUEST, Request.LOGOUT_REQUEST.toString());
//        outputMap.put(Request.LOGIN_PAGE_REQUEST, Request.LOGIN_PAGE_REQUEST.toString());
//        outputMap.put(Request.MACRO_LOG_PAGE_REQUEST, Request.MACRO_LOG_PAGE_REQUEST.toString());
//        outputMap.put(Request.CREATE_ACCOUNT_REQUEST, Request.CREATE_ACCOUNT_REQUEST.toString());
//        outputMap.put(Request.CREATE_ACCOUNT_PAGE_REQUEST, Request.CREATE_ACCOUNT_PAGE_REQUEST.toString());
//        outputMap.put(Request.WORKOUT_LOG_PAGE_REQUEST, Request.WORKOUT_LOG_PAGE_REQUEST.toString());
//        outputMap.put(Request.CUSTOM_FOODS_PAGE_REQUEST, Request.CUSTOM_FOODS_PAGE_REQUEST.toString());
//        outputMap.put(Request.MY_STATS_PAGE_REQUEST, Request.MY_STATS_PAGE_REQUEST.toString());
//        outputMap.put(Request.FORGOT_PASSWORD_PAGE_REQUEST, Request.FORGOT_PASSWORD_PAGE_REQUEST.toString());
//        outputMap.put(Request.FORGOT_PASSWORD_EMAIL_REQUEST, Request.FORGOT_PASSWORD_EMAIL_REQUEST.toString());
//        outputMap.put(Request.CHANGE_PASSWORD_PAGE_REQUEST, Request.CHANGE_PASSWORD_PAGE_REQUEST.toString());
//        outputMap.put(Request.CHANGE_PASSWORD_REQUEST, Request.CHANGE_PASSWORD_REQUEST.toString());
//        outputMap.put(Request.CHANGE_EMAIL_REQUEST, Request.CHANGE_EMAIL_REQUEST.toString());
//        outputMap.put(Request.SETTINGS_PAGE_REQUEST, Request.SETTINGS_PAGE_REQUEST.toString());
//        outputMap.put(Request.DELETE_ACCOUNT_REQUEST, "deleteAccount");
//        outputMap.put(Request.GET_CUSTOM_FOOD_LIST, "getCustomFoodList");
//        outputMap.put(Request.DELETE_CUSTOM_FOOD, "deleteCustomFood");
//        outputMap.put(Request.CREATE_CUSTOM_FOOD, "createCustomFood");
//        outputMap.put(Request.EDIT_CUSTOM_FOOD, "editCustomFood");
//        outputMap.put(Request.ADD_EATEN_FOOD, "addEatenFood");
//        outputMap.put(Request.GET_EATEN_FOOD_LIST, "getEatenFoodList");
//        outputMap.put(Request.REMOVE_EATEN_FOOD, "removeEatenFood");
//        outputMap.put(Request.SEARCH_FOR_FOOD, "searchForFood");
//        outputMap.put(Request.MODIFY_SELECTED_ATTRIBUTES, "modifySelectedAttributes");
//        outputMap.put(Request.GET_FOOD_ATTRIBUTES, "getViewableAttributesList");
//        outputMap.put(Request.GET_FRIENDLY_NAMES, "getFriendlyNames");
//        outputMap.put(Request.MODIFY_USER_STATS, "modifyUserStats");
//        outputMap.put(Request.GET_USER_STATS, "getUserStats");
//        outputMap.put(Request.GET_IDENTIFIER_TOKEN_EMAIL, "getIdentifierTokenEmail");
//        outputMap.put(Request.GET_SERVER_API, "getServerAPI");
        return outputList;
    }

    private static Map<ErrorCode, Integer> setupERROR_CODES_MAP()
    {
        Map<ErrorCode, Integer> outputMap = new HashMap<>();
        int errorNumber = 10;
        for(ErrorCode code : errorCodesEnumSet)
        {
            //EnumSet docs promises a natural ordering of the enums
            //so errorNumber should always be attached to the same error
            outputMap.put(code, errorNumber);
            errorNumber++;

        }
        
        
//        outputMap.put(ErrorCode.PASSWORD_TOO_SHORT, "10");
//        outputMap.put(ErrorCode.ACCOUNT_ALREADY_EXISTS, "11");
//        outputMap.put(ErrorCode.ACCOUNT_DOSENT_EXIST, "12");
//        outputMap.put(ErrorCode.FORGOT_PASSWORD_TOKEN_EXPIRED_OR_ALREADY_USED, "13");
//        outputMap.put(ErrorCode.PASSWORD_CHANGE_FAILED, "14");
//        outputMap.put(ErrorCode.AUTHENTICATION_FAILED, "15");
//        outputMap.put(ErrorCode.AUTHORIZATION_FAILED, "16");
//        outputMap.put(ErrorCode.CHANGE_EMAIL_FAILED, "17");
//        outputMap.put(ErrorCode.UPDATE_ATTRIBUTES_FAILED, "18");
//        outputMap.put(ErrorCode.ADD_CUSTOM_FOOD_FAILED, "19");
//        outputMap.put(ErrorCode.ADD_EATEN_FOOD_FAILED, "20");
        return outputMap;
    }

    /**
     * Returns a map with only strings, useful for when JSON is needed.
     * The error number is changed to the key and the errorCode is repurposed as the value
     * as the client will have no access to Enum class ErrorCode. So searching for an error by number
     * will be easier.
     * @param errorCodesMap
     * @return Map<String,String> version of ERROR_CODES_MAP
     */
    private static Map<String, String> setupERROR_CODES_MAP_STRING(Map<ErrorCode, Integer> errorCodesMap)
    {
        Map<String, String> outputMap = new HashMap<>();
        Iterator iterator = errorCodesMap.entrySet().iterator();
        while (iterator.hasNext())
        {
            Map.Entry pair = (Map.Entry) iterator.next();
            outputMap.put(pair.getValue().toString(), pair.getKey().toString());
            //System.out.println(pair.getKey() + " = " + pair.getValue());
            //iterator.remove(); // avoids a ConcurrentModificationException
        }
        return outputMap;
    }

    /**
     * Returns a map with only strings, useful for when JSON is needed.
     *
     * @param serverAPIMap
     * @return Map<String,String> version of REQUESTS_API_MAP
     */
    private static Map<String, String> setupREQUESTS_API_MAP_STRING(List<Request> requestsAPIMap)
    {
        Map<String, String> outputMap = new HashMap<>();
        for (Request aRequest : requestsAPIMap)
        {
            outputMap.put(aRequest.toString(), "/" + FRONT_CONTROLLER_NAME + "/" + aRequest.toString());
        }

//        Iterator iterator = requestsAPIMap.entrySet().iterator();
//        while (iterator.hasNext())
//        {
//            Map.Entry pair = (Map.Entry) iterator.next();
//            outputMap.put(pair.getKey().toString(), "/" + FRONT_CONTROLLER_NAME + "/" + pair.getValue().toString());
//            //System.out.println(pair.getKey() + " = " + pair.getValue());
//            //iterator.remove(); // avoids a ConcurrentModificationException
//        }
        return outputMap;
    }

//    public static Map<Requests, String> getREQUESTS_API_MAP()
//    {
//        return Collections.unmodifiableMap(REQUESTS_API_MAP);
//    }
//
    public static Map<String, String> getREQUESTS_API_MAP_STRING()
    {
        return Collections.unmodifiableMap(REQUESTS_API_MAP_STRING);
    }
    public static Integer getErrorCodeFromEnum(ErrorCode code)
    {
        return ERROR_CODES_MAP.get(code);
    }

//    public static String getRequestStringFromEnum(Request request)
//    {
//        return REQUESTS_API_MAP.get(request);
//    }

    public static Map<String, String> getERROR_CODES_MAP_STRING()
    {
        return Collections.unmodifiableMap(ERROR_CODES_MAP_STRING);
    }
}
