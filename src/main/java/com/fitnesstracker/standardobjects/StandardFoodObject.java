/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.standardobjects;

import com.fitnesstracker.globalvalues.GlobalValues;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author max
 */
public class StandardFoodObject
{

    private Map<String, String> primaryFoodProperties;
    private Map<String, String> secondaryFoodProperties;
    private Map<String, String> vitamins;
    private Map<String, String> minerals;
    private Map<String, String> identifierFoodProperties;
    private Map<String, String> descriptiveFoodProperties;

    public Map<String, String> getPrimaryFoodAttributes()
    {
        return primaryFoodProperties;
    }

    public void setPrimaryFoodAttributes(Map<String, String> primaryFoodProperties)
    {
        this.primaryFoodProperties = primaryFoodProperties;
    }

    public Map<String, String> getSecondaryFoodAttributes()
    {
        return secondaryFoodProperties;
    }

    public void setSecondaryFoodAttributes(Map<String, String> secondaryFoodProperties)
    {
        this.secondaryFoodProperties = secondaryFoodProperties;
    }

    public Map<String, String> getIdentifierFoodAttributes()
    {
        return identifierFoodProperties;
    }

    public void setIdentifierFoodAttributes(Map<String, String> identifierFoodProperties)
    {
        this.identifierFoodProperties = identifierFoodProperties;
    }

    public Map<String, String> getDescriptiveFoodAttributes()
    {
        return descriptiveFoodProperties;
    }

    public void setDescriptiveFoodAttributes(Map<String, String> descriptiveFoodProperties)
    {
        this.descriptiveFoodProperties = descriptiveFoodProperties;
    }

    public Map<String, String> getVitamins()
    {
        return vitamins;
    }

    public void setVitamins(Map<String, String> vitamins)
    {
        this.vitamins = vitamins;
    }

    public Map<String, String> getMinerals()
    {
        return minerals;
    }

    public void setMinerals(Map<String, String> minerals)
    {
        this.minerals = minerals;
    }

    public Map<String, String> getAsSingleMap()
    {
        Map<String, String> output = new HashMap<>();
        List<Map<String, String>> allMapReferences = new ArrayList<>();
        allMapReferences.add(this.primaryFoodProperties);
        allMapReferences.add(this.secondaryFoodProperties);
        allMapReferences.add(this.identifierFoodProperties);
        allMapReferences.add(this.descriptiveFoodProperties);
        allMapReferences.add(this.vitamins);
        allMapReferences.add(this.minerals);

        for (Map<String, String> currentMap : allMapReferences)
        {
            for (Map.Entry<String, String> entry : currentMap.entrySet())
            {
                String key = entry.getKey();
                String value = entry.getValue();
                output.put(key, value);
            }
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

        Map<String, String> primaryFoodPropertiesMap = new HashMap<>();
        List<String> primaryFoodPropertiesList = GlobalValues.getPRIMARY_FOOD_PROPERTIES();
        fillMapWithNull(primaryFoodPropertiesMap, primaryFoodPropertiesList);
        outputMap.put("primaryFoodProperties", primaryFoodPropertiesMap);

        Map<String, String> secondaryFoodPropertiesMap = new HashMap<>();
        List<String> secondaryFoodPropertiesList = GlobalValues.getSECONDARY_FOOD_PROPERTIES();
        fillMapWithNull(secondaryFoodPropertiesMap, secondaryFoodPropertiesList);
        outputMap.put("secondaryFoodProperties", secondaryFoodPropertiesMap);
        
        Map<String, String> vitaminsMap = new HashMap<>();
        List<String> vitaminsList = GlobalValues.getVITAMINS();
        fillMapWithNull(vitaminsMap, vitaminsList);
        outputMap.put("vitamins", vitaminsMap);
        
        Map<String, String> mineralsMap = new HashMap<>();
        List<String> mineralsList = GlobalValues.getMINERALS();
        fillMapWithNull(mineralsMap, mineralsList);
        outputMap.put("minerals", mineralsMap);

        Map<String, String> identifierFoodPropertiesMap = new HashMap<>();
        List<String> identifierFoodPropertiesList = GlobalValues.getIDENTIFIER_FOOD_PROPERTIES();
        fillMapWithNull(identifierFoodPropertiesMap, identifierFoodPropertiesList);
        outputMap.put("identifierFoodProperties", identifierFoodPropertiesMap);

        Map<String, String> descriptiveFoodPropertiesMap = new HashMap<>();
        List<String> descriptiveFoodPropertiesList = GlobalValues.getDESCRIPTIVE_FOOD_PROPERTIES();
        fillMapWithNull(descriptiveFoodPropertiesMap, descriptiveFoodPropertiesList);
        outputMap.put("descriptiveFoodProperties", descriptiveFoodPropertiesMap);

        outputMap.put("unixTime", null);
        return outputMap;
    }

    private static void fillMapWithNull(Map<String, String> inputMap, List<String> inputList)
    {
        for (String element : inputList)
        {
            inputMap.put(element, "null");
        }
    }

    @Override
    public String toString()
    {
        String newLine = "\n";
        return "primaryFoodProperties: " + this.primaryFoodProperties
                + newLine
                + "secondaryFoodProperties: " + this.secondaryFoodProperties
                + newLine
                 + "vitamins: " + this.vitamins
                + newLine
                 + "minerals: " + this.minerals
                + newLine
                + "identifierFoodProperties: " + this.identifierFoodProperties
                + newLine
                + "descriptiveFoodProperties: " + this.descriptiveFoodProperties;
    }
}
