/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.standardobjects;

import com.fitnesstracker.globalvalues.GlobalValues;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author max
 */
public class StandardFoodObject
{
    private Map<String, String> primaryFoodAttributes;
    private Map<String, String> secondaryFoodAttributes;
    private Map<String, String> identifierFoodAttributes;
    private Map<String, String> descriptiveFoodAttributes;

    public Map<String, String> getPrimaryFoodAttributes()
    {
        return primaryFoodAttributes;
    }

    public void setPrimaryFoodAttributes(Map<String, String> primaryFoodAttributes)
    {
        this.primaryFoodAttributes = primaryFoodAttributes;
    }

    public Map<String, String> getSecondaryFoodAttributes()
    {
        return secondaryFoodAttributes;
    }

    public void setSecondaryFoodAttributes(Map<String, String> secondaryFoodAttributes)
    {
        this.secondaryFoodAttributes = secondaryFoodAttributes;
    }

    public Map<String, String> getIdentifierFoodAttributes()
    {
        return identifierFoodAttributes;
    }

    public void setIdentifierFoodAttributes(Map<String, String> identifierFoodAttributes)
    {
        this.identifierFoodAttributes = identifierFoodAttributes;
    }

    public Map<String, String> getDescriptiveFoodAttributes()
    {
        return descriptiveFoodAttributes;
    }

    public void setDescriptiveFoodAttributes(Map<String, String> descriptiveFoodAttributes)
    {
        this.descriptiveFoodAttributes = descriptiveFoodAttributes;
    }

    public Map<String, String> getAsSingleMap()
    {
        Map<String, String> output = new HashMap<>();

        for (Map.Entry<String, String> entry : primaryFoodAttributes.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            output.put(key, value);
        }
        for (Map.Entry<String, String> entry : secondaryFoodAttributes.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            output.put(key, value);
        }
        for (Map.Entry<String, String> entry : identifierFoodAttributes.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            output.put(key, value);
        }
        for (Map.Entry<String, String> entry : descriptiveFoodAttributes.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            output.put(key, value);
        }

        return output;
    }

    /**
     * This returns an empty food object filled with null values. This map does
     * NOT represent the current state of the object in any way. The layout map
     * is intended to be sent to the client so the client knows the format of
     * Json objects to send back to the server.
     *
     * @return
     */
    public static Map<String, Object> getEmptyObject()
    {
        Map<String, Object> outputMap = new HashMap<>();
        
        Map<String, String> primaryFoodAttributesMap = new HashMap<>();
        List<String> primaryFoodAttributesList = GlobalValues.getPRIMARY_FOOD_ATTRIBUTES();
        fillMapWithNull(primaryFoodAttributesMap, primaryFoodAttributesList);       
        outputMap.put("primaryFoodAttributes", primaryFoodAttributesMap);
        
        Map<String, String> secondaryFoodAttributesMap = new HashMap<>();
        List<String> secondaryFoodAttributesList = GlobalValues.getSECONDARY_FOOD_ATTRIBUTES();
        fillMapWithNull(secondaryFoodAttributesMap, secondaryFoodAttributesList);
        outputMap.put("secondaryFoodAttributes", secondaryFoodAttributesMap);
        
        Map<String, String> identifierFoodAttributesMap = new HashMap<>();
        List<String> identifierFoodAttributesList = GlobalValues.getIDENTIFIER_FOOD_ATTRIBUTES();
        fillMapWithNull(identifierFoodAttributesMap, identifierFoodAttributesList);
        outputMap.put("identifierFoodAttributes", identifierFoodAttributesMap);

        
        Map<String, String> descriptiveFoodAttributesMap = new HashMap<>();
        List<String> descriptiveFoodAttributesList = GlobalValues.getDESCRIPTIVE_FOOD_ATTRIBUTES();
        fillMapWithNull(descriptiveFoodAttributesMap, descriptiveFoodAttributesList);        
        outputMap.put("descriptiveFoodAttributes", descriptiveFoodAttributesMap);
        
        outputMap.put("unixTime", null);
        return outputMap;
    }
    
    private static void fillMapWithNull(Map<String, String> inputMap, List<String> inputList)
    {
        for(String element : inputList)
        {
            inputMap.put(element, "null");
        }   
    }
    
    @Override
    public String toString()
    {
        String newLine = "\n";
        return "primaryFoodAttributes: " + this.primaryFoodAttributes
                + newLine
                + "secondaryFoodAttributes: " + this.secondaryFoodAttributes
                + newLine
                + "identifierFoodAttributes: " + this.identifierFoodAttributes
                + newLine
                + "descriptiveFoodAttributes: " + this.descriptiveFoodAttributes;
    }
}
