/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.standardobjects;

import com.fitnesstracker.globalvalues.GlobalValues;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class organizes the list of foods acquired from the database. It takes
 * each food and puts its attributes into categories.
 *
 * It takes a List of Maps where each Map object represents a food
 * object.Something like this List containing two foods:
 *
 * [
 * {foodname="cake", protein="10", sodium="100", foodId="131"}, {foodname="pie",
 * protein="34", sodium="1432", foodId="132"} ]
 *
 * It then organizes the food attributes into categories and assigns them to the
 * appropriate map. The end result would look like this:
 *
 * [
 * {primaryFoodAttributes:{protein="10"},
 * secondaryFoodAttributes:{sodium="100"},
 * identifierFoodAttributes:{foodId="131"},
 * descriptiveFoodAttributes:{foodname:"cake"},
 * {primaryFoodAttributes:{protein="34"},
 * secondaryFoodAttributes:{sodium="1432"},
 * identifierFoodAttributes:{foodId="132"},
 * descriptiveFoodAttributes:{foodname:"pie"} ]
 *
 * Overall this makes it easier for the client to process food data
 */
@Deprecated
public class StandardFoodList
{

    private static final Logger log = LoggerFactory.getLogger(StandardFoodList.class);
    
    private final String primaryFoodAttributesId = "primaryFoodAttributes";
    private final String secondaryFoodAttributesId = "secondaryFoodAttributes";
    private final String identifierFoodAttributesId = "identifierFoodAttributes";
    private final String descriptiveFoodAttributesId = "descriptiveFoodAttributes";

    private final List<Map> organizedFoodList;

    /**
     *
     * @param inputList a List of Maps where each Map object represents a food
     */
    @Deprecated
    public StandardFoodList(List<Map> inputList)
    {
        this.organizedFoodList = new ArrayList<>();
        this.organizeIntoCategories(inputList);
    }

    /**
     * The method then organizes the food attributes into categories and assigns
     * them to the appropriate map.
     *
     * @param inputList a List object full of Maps, each map represents a food
     * item
     */
    private void organizeIntoCategories(List<Map> inputList)
    {
        List primaryFoodAttributesList = GlobalValues.getPRIMARY_FOOD_PROPERTIES();
        List secondaryFoodAttributesList = GlobalValues.getSECONDARY_FOOD_PROPERTIES();
        List identifierFoodAttributesList = GlobalValues.getIDENTIFIER_FOOD_PROPERTIES();
        List descriptiveFoodAttributesList = GlobalValues.getDESCRIPTIVE_FOOD_PROPERTIES();

        //iterate over each food
        for (Map<String, String> food : inputList)
        {
            Map foodMap = new HashMap<>();
            Map primaryFoodAttributes = new HashMap<>();
            Map secondaryFoodAttributes = new HashMap<>();
            Map identifierFoodAttributes = new HashMap<>();
            Map descriptiveFoodAttributes = new HashMap<>();

            //organize the food attributes into their own maps
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
            foodMap.put(primaryFoodAttributesId, primaryFoodAttributes);
            foodMap.put(secondaryFoodAttributesId, secondaryFoodAttributes);
            foodMap.put(identifierFoodAttributesId, identifierFoodAttributes);
            foodMap.put(descriptiveFoodAttributesId, descriptiveFoodAttributes);
            organizedFoodList.add(foodMap);
        }
    }

    private String getJSONString()
    {
        log.trace("getJSONString()");
        Gson gson = new Gson();
        String JSONString = gson.toJson(organizedFoodList);
        log.debug(JSONString);
        return JSONString;
    }

    /**
     * This method returns a single map containing all the maps in this object,
     * primaryFoodAttributes, secondaryFoodAttributes, identifierFoodAttributes,
     * descriptiveFoodAttributes.
     *
     * It used so that Gson will be able to marshal the nested maps into a Json
     * String.
     *
     * @return a single Map<String,Map> object containing all maps in this
     * object
     */
    public List<Map> getOrganizedFoodList()
    {
        return organizedFoodList;
    }

    @Override
    public String toString()
    {
        return this.getJSONString();
    }

}
