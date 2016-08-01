/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.standardobjects.StandardFoodObject;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
public class ServletUtilities
{

    private static final Logger log = LoggerFactory.getLogger(ServletUtilities.class);

    /**
     * This gets the request data which should be a string in JSON format then
     * returns it.
     *
     * @param request
     * @return a JSON string with the request data
     */
    public static String getPOSTRequestJSONString(HttpServletRequest request)
    {
        log.trace("getPOSTRequestJSONString()");

        BufferedReader reader = null;
        try
        {
            reader = request.getReader();
        } catch (IOException ex)
        {
            log.error("error getting reader from request object", ex);
        }
        StringBuilder buffer = new StringBuilder();
        String currentLine;

        try
        {
            //reader.readLine() is within the while head to avoid "null" being
            //appended on at the end, this happens if it is in the body
            while ((currentLine = reader.readLine()) != null)
            {
                buffer.append(currentLine);
            }
        } catch (IOException ex)
        {
            log.error("error using reader, possible null reader object", ex);
        }

        String jsonString = buffer.toString();
        log.debug(jsonString);
        return jsonString;
    }

    public static Map<String, String> convertJSONStringToMap(String aJSONString)
    {
        log.trace("convertJSONStringToMap()");
        log.debug("aJSONString:" + aJSONString);
        Gson gson = new Gson();
        Type stringStringMap = new TypeToken<LinkedHashMap<String, String>>()
        {
        }.getType();
        Map<String, String> outputMap = gson.fromJson(aJSONString, stringStringMap);
        log.debug(outputMap.toString());
        return outputMap;
    }

    public static String convertMapToJSONString(Map aMap)
    {
        log.trace("convertMapToJSONString()");
        Gson gson = new Gson();
        String JSONString = gson.toJson(aMap);
        log.debug(JSONString);
        return JSONString;
    }

    /**
     * This method deals with values from an HTML form when jQuerys
     * serializeArray() method is used. The JSON String sent to the server will
     * be in the form: [{name=email, value=test@test.com}, {name=password,
     * value=testtest}] This method will extract the values and return a single
     * map like so: ["email":"test@test.com", "password":"testtest"]
     *
     * @param aJSONArray a string with JSON formatting
     * @return Map<String,String> containing the relevant values from an HTML
     * form
     */
    public static Map<String, String> convertJSONFormDataToMap(String aJSONArray)
    {
        log.trace("convertJSONFormDataToMap()");
        Gson gson = new Gson();
        Type arrayListMap = new TypeToken<ArrayList<Map>>()
        {
        }.getType();

        //list will be in the form
        //list=[{name=email, value=test@test.com}, {name=password, value=testtest}]
        List<Map> loginList = gson.fromJson(aJSONArray, arrayListMap);
        Map<String, String> output = new HashMap<>();

        for (Map<String, String> currentMap : loginList)
        {
            String currentKey = currentMap.get("name");
            String currentValue = currentMap.get("value");
            if (currentValue.equals(""))
            {
                currentValue = null;
            }
            output.put(currentKey, currentValue);
        }
        log.debug(output.toString());
        return output;
    }

    public static UserObject getCurrentUser(HttpServletRequest request)
    {
        return (UserObject) request.getSession().getAttribute("user");
    }
    
    public static List<Map> organizeEatenFoodList(List<Map> inputList)
    {
        List<Map> outputList = new ArrayList<>();

        List primaryFoodAttributesList = GlobalValues.getPRIMARY_FOOD_ATTRIBUTES();
        List secondaryFoodAttributesList = GlobalValues.getSECONDARY_FOOD_ATTRIBUTES();
        List identifierFoodAttributesList = GlobalValues.getIDENTIFIER_FOOD_ATTRIBUTES();
        List descriptiveFoodAttributesList = GlobalValues.getDESCRIPTIVE_FOOD_ATTRIBUTES();

        for (Map<String, String> food : inputList)
        {
            Map foodMap = new HashMap<>();
            Map primaryFoodAttributes = new HashMap<>();
            Map secondaryFoodAttributes = new HashMap<>();
            Map identifierFoodAttributes = new HashMap<>();
            Map descriptiveFoodAttributes = new HashMap<>();

            for (Map.Entry<String, String> currentElement : food.entrySet())
            {
                String key = currentElement.getKey();
                String value = currentElement.getValue();

                if (primaryFoodAttributesList.contains(key))
                {
                    primaryFoodAttributes.put(key, value);
                } else if (secondaryFoodAttributesList.contains(key))
                {
                    secondaryFoodAttributes.put(key, value);
                } else if (identifierFoodAttributesList.contains(key))
                {
                    identifierFoodAttributes.put(key, value);
                } else if (descriptiveFoodAttributesList.contains(key))
                {
                    descriptiveFoodAttributes.put(key, value);
                }
            }
            foodMap.put("primaryFoodAttributes",primaryFoodAttributes);
            foodMap.put("secondaryFoodAttributes",secondaryFoodAttributes);
            foodMap.put("identifierFoodAttributes",identifierFoodAttributes);
            foodMap.put("descriptiveFoodAttributes",descriptiveFoodAttributes);
            outputList.add(foodMap);
        }
        return outputList;
    }

}
