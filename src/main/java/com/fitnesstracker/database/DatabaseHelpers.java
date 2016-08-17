/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.database;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
public class DatabaseHelpers
{
    private static final Logger log = LoggerFactory.getLogger(DatabaseHelpers.class);

    /**
     * This method protects the client from the idiosyncrasies of the database
     * and its dislike for camel case. The database uses underscore_case for its
     * table and column names.
     *
     * @param input
     * @return
     */
    static String convertUnderscoreToCamelCase(String input)
    {
        //log.trace("convertUnderscoreToCamelCase()");

        char[] inputArray = input.toCharArray();
        StringBuilder output = new StringBuilder();
        boolean capitolizeNextChar = false;
        for (int count = 0; count < inputArray.length; count++)
        {
            char currentChar = inputArray[count];

            if (currentChar != '_' && capitolizeNextChar)
            {
                currentChar = Character.toUpperCase(currentChar);
                output.append(currentChar);
                capitolizeNextChar = false;
            } else if (currentChar == '_')
            {
                capitolizeNextChar = true;
            } else
            {
                output.append(currentChar);
            }
        }
        return output.toString();
    }

    static List convertResultSetToList(ResultSet aResultSet) throws SQLException
    {
        log.trace("convertResultSetToList()");
        log.debug(aResultSet.toString());
        //turn resultset into arraylist with maps in iterator
        //each attributeMap represents a single row
        ResultSetMetaData resultSetMetaData = aResultSet.getMetaData();
        List mainList = new ArrayList<>();
        int columnCount = resultSetMetaData.getColumnCount();
        while (aResultSet.next())
        {
            int currentColumn = 1;
            Map currentRecord = new HashMap();

            while (currentColumn <= columnCount)
            {
                String columnName = resultSetMetaData.getColumnName(currentColumn);
                columnName = convertUnderscoreToCamelCase(columnName);
                String columnValue = aResultSet.getString(currentColumn);

                currentRecord.put(columnName, columnValue);
                currentColumn++;
            }
            mainList.add(currentRecord);
        }
        log.debug(mainList.toString());
        return mainList;
    }

    static Map convertResultSetToMap(ResultSet aResultSet) throws SQLException
    {
        log.trace("convertResultSetToMap()");
        log.debug(aResultSet.toString());
        //turn resultset into a map
        ResultSetMetaData resultSetMetaData = aResultSet.getMetaData();
        Map mainMap = new HashMap<>();
        int columnCount = resultSetMetaData.getColumnCount();
        while (aResultSet.next())
        {
            int currentColumn = 1;
            while (currentColumn <= columnCount)
            {
                String columnName = resultSetMetaData.getColumnName(currentColumn);
                columnName = convertUnderscoreToCamelCase(columnName);
                String columnValue = aResultSet.getString(currentColumn);

                mainMap.put(columnName, columnValue);
                currentColumn++;
            }
        }
        log.debug(mainMap.toString());
        return mainMap;
    }

    /**
     * This method filters out results which do not contain ALL of the users
     * search terms. e.g if the user typed "skimmed milk" then foods with names
     * that do not contain both the words "skimmed" and "milk" are removed.
     *
     *
     * @param aList a list of Map objects, each map represents a food
     * @param searchedString the string the user typed into the search box
     * @return a list with probable irrelevant results removed
     * @throws SQLException
     */
    static List filterResults(List aList, String searchedString) throws SQLException
    {
        log.trace("filterResults()");
        log.debug(aList.toString());
        log.debug(searchedString);
        String[] searchWords = searchedString.split(" ");
        List outputList = new ArrayList<>();

        for (int count = 0; count < aList.size(); count++)
        {
            Map currentFood = (Map) aList.get(count);
            String currentFoodName = (String) currentFood.get("foodname");

            int searchWordMatches = 0;
            for (String searchWord : searchWords)
            {
                if (currentFoodName.contains(searchWord))
                {
                    searchWordMatches++;
                }
            }

            if (searchWordMatches == searchWords.length)
            {
                outputList.add(currentFood);
            }
        }
        log.debug("filtered list:" + outputList);
        return outputList;
    }
    
    static UUID generateUuid()
    {
        UUID randomUUID = UUID.randomUUID();
        return randomUUID;
    }
}
