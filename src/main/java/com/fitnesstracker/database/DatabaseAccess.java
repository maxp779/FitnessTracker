/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.database;

import com.fitnesstracker.core.UserObject;
import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.serverAPI.ErrorCode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

/**
 * This class deals with accessing the database, the methods are largely self
 * explanatory. The accompanying SQL commands are stored in the class
 * GlobalSQLCommands
 *
 * @author max
 */
public class DatabaseAccess
{

    private static final Logger log = LoggerFactory.getLogger(DatabaseAccess.class);

//    Old SQL Commands, methods that used these were refactored to create their command dynamically as they execute with a StringBuilder object
//    private static final String addcustomfoodSQL = "INSERT INTO custom_foods_table (id_user,foodname,protein,carbohydrate,fat,calorie) VALUES (?,?,?,?,?,?)";
//    private static final String addeatenfoodSQL = "INSERT INTO eaten_foods_table (id_user,foodname,protein,carbohydrate,fat,calorie,timestamp) VALUES (?,?,?,?,?,?,?)";
//    private static final String editcustomfoodSQL = "UPDATE custom_foods_table SET foodname=?,protein=?,carbohydrate=?,fat=?,calorie=? WHERE id_customfood=?";
//    private static final String modifyUserStatsSQL = "UPDATE viewable_attributes_table SET foodcode=?,foodname=?,foodnameoriginal=?,description=?,foodgroup=?,previous=?,foodreferences=?,footnote=?,water=?,"
//            + "totnit=?,protein=?,fat=?,carbohydrate=?,calorie=?,kj=?,star=?,oligo=?,totsug=?,gluc=?,galact=?,fruct=?,sucr=?,malt=?,lact=?,alco=?,engfib=?,aoacfib=?,satfac=?,"
//            + "satfod=?,totn6pfac=?,totn6pfod=?,totn3pfac=?,totn3pfod=?,monofacc=?,monofodc=?,monofac=?,monofod=?,polyfacc=?,polyfodc=?,polyfac=?,polyfod=?,satfacx6=?,satfodx6=?,"
//            + "totbrfac=?,totbrfod=?,factrans=?,fodtrans=?,chol=?,weight=?,sodium=? WHERE id_user=?";
    //Supported food attributes, this omits items that are added automatically
    /**
     *
     * @param loginAttemptEmail
     * @return A Map object containing the users email and password or null if
     * they were not found
     */
    public static Map<String, String> getUserCredentialsFromEmail(String loginAttemptEmail)
    {
        log.trace("getUserCredentialsFromEmail()");
        log.debug(loginAttemptEmail);
        String getusercredentialsfromemailSQL = "SELECT email,password,id_user FROM user_table WHERE email = ?";

        String retrievedEmail = null;
        String retrievedPassword = null;
        String retrieved_id_user = null;
        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckEmail(loginAttemptEmail))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getusercredentialsfromemailSQL);)
            {
                getEmailStatement.setString(1, loginAttemptEmail);
                try (ResultSet resultSet = getEmailStatement.executeQuery())
                {
                    if (resultSet.next())
                    {
                        retrievedEmail = resultSet.getString("email");
                        retrievedPassword = resultSet.getString("password");
                        retrieved_id_user = resultSet.getString("id_user");
                    }
                }

            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }

            Map<String, String> outputMap = new HashMap<>();
            outputMap.put("email", retrievedEmail);
            outputMap.put("password", retrievedPassword);
            outputMap.put("id_user", retrieved_id_user);
            log.debug(outputMap.toString());
            return outputMap;
        } else //user dosent exist
        {
            return null;
        }
    }

    public static String getStoredPassword(UserObject userObject)
    {
        log.trace("getStoredPassword()");
        log.debug(userObject.toString());
        String getusercredentialsfromid_userSQL = "SELECT password FROM user_table WHERE id_user = ?";

        String hashedPassword = null;
        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckid_user(userObject.getId_user()))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getusercredentialsfromid_userSQL);)
            {
                getEmailStatement.setLong(1, Long.parseLong(userObject.getId_user()));

                try (ResultSet resultSet = getEmailStatement.executeQuery();)
                {
                    resultSet.next();
                    hashedPassword = resultSet.getString("password");
                }

            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }
        }
        log.debug(hashedPassword);
        return hashedPassword;
    }

    public static Map<String, String> getUserCredentialsFromid_user(String id_user)
    {
        log.trace("getUserCredentialsFromid_user()");
        log.debug(id_user);
        String getusercredentialsfromid_userSQL = "SELECT email,password,id_user FROM user_table WHERE id_user = ?";

        String retrievedEmail = null;
        String retrievedPassword = null;
        String retrieved_id_user = null;

        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckid_user(id_user))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getusercredentialsfromid_userSQL);)
            {
                getEmailStatement.setLong(1, Long.parseLong(id_user));

                try (ResultSet resultSet = getEmailStatement.executeQuery();)
                {
                    resultSet.next();
                    retrievedEmail = resultSet.getString("email");
                    retrievedPassword = resultSet.getString("password");
                    retrieved_id_user = resultSet.getString("id_user");
                }

            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }
            Map outputMap = new HashMap<>();
            outputMap.put("email", retrievedEmail);
            outputMap.put("hashedPassword", retrievedPassword);
            outputMap.put("id_user", retrieved_id_user);
            log.debug(outputMap.toString());
            return outputMap;
        } else //user dosent exist
        {
            return null;
        }
    }

    public static boolean addUser(String anEmail, String aPassword)
    {
        log.trace("addUser()");
        log.debug(anEmail + " " + aPassword);
        String adduserSQL = "INSERT INTO user_table (email,password) VALUES (?,?)";
        int userAdded = 0;

        boolean userAlreadyExists = DatabaseAccess.userAlreadyExistsCheckEmail(anEmail);
        if (!userAlreadyExists)
        {
            log.info("adding user");
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement addUserStatement = databaseConnection.prepareStatement(adduserSQL);)
            {
                addUserStatement.setString(1, anEmail);
                addUserStatement.setString(2, aPassword);
                userAdded = addUserStatement.executeUpdate();

                //setup defaults for the new user
                if (userAdded != 0)
                {
                    String id_user = getid_user(anEmail);
                    setupSelectedAttributes(id_user);
                    setupUserStats(id_user);
                }
            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }
        } else
        {
            log.info("user already exists");
        }

        return userAdded != 0;
    }

    public static boolean userAlreadyExistsCheckEmail(String anEmail)
    {
        log.trace("userAlreadyExistsCheckEmail()");
        log.debug(anEmail);
        String checkforuseremailSQL = "SELECT email FROM user_table WHERE email = ?";

        boolean userAlreadyExists = true;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement checkUserStatement = databaseConnection.prepareStatement(checkforuseremailSQL);)
        {
            checkUserStatement.setString(1, anEmail);
            try (ResultSet resultSet = checkUserStatement.executeQuery();)
            {

                if (resultSet.next())
                {
                    log.info("user already in the database");
                    userAlreadyExists = true;
                } else
                {
                    log.info("user not in the database");
                    userAlreadyExists = false;
                }
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug(String.valueOf(userAlreadyExists));
        return userAlreadyExists;
    }

    public static boolean userAlreadyExistsCheckid_user(String id_user)
    {
        log.trace("userAlreadyExistsCheckid_user()");
        log.debug(id_user);
        String checkforuserid_userSQL = "SELECT id_user FROM user_table WHERE id_user = ?";

        boolean userAlreadyExists = true;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement checkUserStatement = databaseConnection.prepareStatement(checkforuserid_userSQL);)
        {
            checkUserStatement.setLong(1, Long.parseLong(id_user));

            try (ResultSet resultSet = checkUserStatement.executeQuery();)
            {
                if (resultSet.next())
                {
                    log.info("user already in the database");
                    userAlreadyExists = true;
                } else
                {
                    log.info("user not in the database");
                    userAlreadyExists = false;
                }
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug(String.valueOf(userAlreadyExists));
        return userAlreadyExists;
    }

    public static String getid_user(String anEmail)
    {
        log.trace("getid_user()");
        log.debug(anEmail);
        String getid_userSQL = "SELECT id_user FROM user_table WHERE email = ?";

        Long id_user_long = null;
        String id_user_string = null;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getuserIDStatement = databaseConnection.prepareStatement(getid_userSQL);)
        {
            getuserIDStatement.setString(1, anEmail);

            try (ResultSet resultSet = getuserIDStatement.executeQuery();)
            {
                if (resultSet.next())
                {
                    id_user_long = resultSet.getLong(1);
                    id_user_string = id_user_long.toString();
                }
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug(id_user_string);
        return id_user_string;
    }

    public static List getCustomFoodList(String id_user)
    {
        log.trace("getCustomFoodList()");
        log.debug(id_user);
        String getcustomfoodlistSQL = "SELECT * FROM custom_foods_table WHERE id_user = ?";

        List resultSetList = null;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getCustomFoodListStatement = databaseConnection.prepareStatement(getcustomfoodlistSQL);)
        {
            getCustomFoodListStatement.setLong(1, Long.parseLong(id_user));
            try (ResultSet resultSet = getCustomFoodListStatement.executeQuery();)
            {
                resultSetList = convertResultSetToList(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug("resultset: " + resultSetList.toString());
        return resultSetList;
    }

    public static boolean deleteCustomFood(String id_customfood)
    {
        log.trace("deleteCustomFood()");
        log.debug(id_customfood);
        String removecustomfoodSQL = "DELETE FROM custom_foods_table WHERE id_customfood= ?";

        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeCustomFoodStatement = databaseConnection.prepareStatement(removecustomfoodSQL);)
        {
            removeCustomFoodStatement.setLong(1, Long.parseLong(id_customfood));
            returnValue = removeCustomFoodStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //0 if nothing was modified in the database, otherwise the rowcount is returned if something was modified
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    private static List convertResultSetToList(ResultSet aResultSet) throws SQLException
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
                currentRecord.put(resultSetMetaData.getColumnName(currentColumn), aResultSet.getString(currentColumn));
                currentColumn++;
            }
            mainList.add(currentRecord);
        }
        log.debug(mainList.toString());
        return mainList;
    }

    private static Map convertResultSetToMap(ResultSet aResultSet) throws SQLException
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
                mainMap.put(resultSetMetaData.getColumnName(currentColumn), aResultSet.getString(currentColumn));
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
    private static List filterResults(List aList, String searchedString) throws SQLException
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

    /**
     * createCustomFood() creates an SQL query dynamically with a StringBuilder
     * object the reason for this is to allow for support for more custom food
     * attributes in the future without too much hassle.
     *
     * example query: INSERT INTO custom_foods_table
     * (id_user,foodname,protein,carbohydrate,fat,calorie) VALUES
     * (100,"oats",15,30,12,400)
     *
     * The query is built in 3 parts The first part is always "INSERT INTO
     * custom_foods_table " The second part is "(colunm1,column2)" based on the
     * attribute names provided by the client The third part is
     * "(value1,column2)" based on the attribute values provided by the client
     * At the end they are concatanated together to form a full SQL query
     *
     * @param customFoodMap a map object representing a new custom food
     * @param id_user the identifier for the current user
     * @return a boolean indicating whether the custom food was added
     * successfully or not
     * @throws java.sql.SQLException
     */
    public static boolean createCustomFood(Map<String, String> customFoodMap, String id_user) throws SQLException
    {
        log.trace("createCustomFood()");
        log.debug(id_user);
        log.debug(customFoodMap.toString());
        StringBuilder addCustomFoodSQL = new StringBuilder();
        addCustomFoodSQL.append("INSERT INTO custom_foods_table ");
        StringBuilder addCustomFoodColumns = new StringBuilder("(");
        StringBuilder addCustomFoodValues = new StringBuilder("VALUES (");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        List<String> varcharAttributes = GlobalValues.getVARCHAR_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);

            addCustomFoodColumns.append(currentAttribute);

            if (count < supportedFoodAttributes.size())
            {

                String currentAttributeValue = customFoodMap.get(currentAttribute);
                //empty strings should not be sent to this method but if they are they are replaced with null
                if (currentAttributeValue != null && currentAttributeValue.equals(""))
                {
                    currentAttributeValue = null;
                }

                //if value is a varchar aka string such as the food name it must be surrounded
                //in quotes e.g 'oats'
                if (varcharAttributes.contains(currentAttribute))
                {
                    addCustomFoodValues.append("'").append(currentAttributeValue).append("'");
                } else //otherwise it is numeric and can be added without quotes
                {
                    addCustomFoodValues.append(currentAttributeValue);
                }
            }

            if (count != supportedFoodAttributes.size() - 1)
            {
                addCustomFoodColumns.append(",");
                addCustomFoodValues.append(",");
            } else //id_user is not part of supportedFoodAttributeList and cannot be treated the same so it is added manually here
            {
                addCustomFoodColumns.append(",id_user)");
                addCustomFoodValues.append(",").append(id_user).append(")");
            }
        }

        addCustomFoodSQL.append(addCustomFoodColumns);
        addCustomFoodSQL.append(addCustomFoodValues);
        String addCustomFoodSQLString = addCustomFoodSQL.toString(); //finished SQL query
        log.debug("finished SQL query:" + addCustomFoodSQLString);
        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement addCustomFoodStatement = databaseConnection.prepareStatement(addCustomFoodSQLString);)
        {
            returnValue = addCustomFoodStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    /**
     * editCustomFood() creates an SQL query dynamically, its purpose is to
     * update the attributes of a particular custom food in the database. Here
     * is an example query: "UPDATE custom_foods_table SET
     * foodname=?,protein=?,carbohydrate=?,fat=?,calorie=? WHERE
     * id_customfood=?"
     *
     *
     * @param customFoodMap a Map containing attribute values for a particular
     * custom food that is to be updated
     * @param id_user the identifier for the current user
     * @return a boolean indicating whether the custom food was added
     * successfully or not
     */
    public static boolean editCustomFood(Map<String, String> customFoodMap, String id_user)
    {
        log.trace("editCustomFood()");
        log.debug(id_user);
        log.debug(customFoodMap.toString());
        StringBuilder editCustomFoodSQL = new StringBuilder();
        editCustomFoodSQL.append("UPDATE custom_foods_table SET ");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        List<String> varcharAttributes = GlobalValues.getVARCHAR_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);

            if (!"id_user".equals(currentAttribute))
            {

                String currentAttributeValue = customFoodMap.get(currentAttribute);
                //empty strings should not be sent to this method but if they are they are replaced with null
                if (currentAttributeValue != null && currentAttributeValue.equals(""))
                {
                    currentAttributeValue = null;
                }
                if (varcharAttributes.contains(currentAttribute))
                {
                    //if value is a varchar aka string such as the food name it must be surrounded
                    //in quotes e.g 'oats'
                    editCustomFoodSQL.append(currentAttribute).append("=").append("'").append(currentAttributeValue).append("'");
                } else
                {
                    editCustomFoodSQL.append(currentAttribute).append("=").append(currentAttributeValue);
                }
            }

            //if not at the last attribute put a comma to separate it from the next attribute
            if (count != supportedFoodAttributes.size() - 1)
            {
                editCustomFoodSQL.append(",");
            } else
            {
                editCustomFoodSQL.append(",id_user=").append(id_user);
                editCustomFoodSQL.append(" WHERE id_customfood=").append(customFoodMap.get("id_customfood"));
            }
        }

        String editCustomFoodSQLString = editCustomFoodSQL.toString(); //finished SQL query
        log.debug(editCustomFoodSQLString);
        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement editCustomFoodStatement = databaseConnection.prepareStatement(editCustomFoodSQLString);)
        {
            returnValue = editCustomFoodStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            System.out.println("SQL ERROR CODE " + ex.getSQLState());
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static List getEatenFoodList(String id_user, LocalDateTime inputTime)
    {
        log.trace("getEatenFoodList()");
        log.debug(id_user);
        log.debug(inputTime.toString());
        String getfoodeatenlistSQL = "SELECT * FROM eaten_foods_table WHERE id_user = ? AND timestamp >= ? AND timestamp < ?";

        //get start of current day and start of next day both in UNIX time
        //this is to retrieve all foods within a single day, so between those two times
        LocalDate toLocalDate = inputTime.toLocalDate();
        LocalDateTime atStartOfDay = toLocalDate.atStartOfDay();
        LocalDateTime atEndOfDay = atStartOfDay.plusDays(1L);

        /**
         * remember if changing this UNIX time is generally in seconds however
         * java.sql.Timestamp objects need milliseconds so seconds *1000
         */
        Timestamp currentDayStartTimestamp = Timestamp.valueOf(atStartOfDay);
        Timestamp nextDayStartTimestamp = Timestamp.valueOf(atEndOfDay);
        log.info("start of selected day " + currentDayStartTimestamp.toString());
        log.info("start of next day " + nextDayStartTimestamp.toString());
        List resultSetList = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getFoodEatenStatement = databaseConnection.prepareStatement(getfoodeatenlistSQL);)
        {
            getFoodEatenStatement.setLong(1, Long.parseLong(id_user));
            getFoodEatenStatement.setTimestamp(2, currentDayStartTimestamp);
            getFoodEatenStatement.setTimestamp(3, nextDayStartTimestamp);
            try (ResultSet resultSet = getFoodEatenStatement.executeQuery();)
            {
                resultSetList = convertResultSetToList(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info("resultset: " + "resultset: " + resultSetList.toString());
        return resultSetList;
    }

    public static boolean addEatenFood(String UnixTime,Map<String, String> eatenFoodMap, String id_user)
    {
        log.trace("addEatenFood()");
        log.debug(id_user);
        log.debug(eatenFoodMap.toString());

        //create SQL query e.g
        //INSERT INTO eaten_foods_table (id_user,foodname,protein,carbohydrate,fat,calorie,timestamp) VALUES (?,?,?,?,?,?,?)
        StringBuilder addEatenFoodSQL = new StringBuilder();
        addEatenFoodSQL.append("INSERT INTO eaten_foods_table ");

        StringBuilder addEatenFoodColumns = new StringBuilder("(");
        StringBuilder addEatenFoodValues = new StringBuilder("VALUES (");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        List<String> varcharAttributes = GlobalValues.getVARCHAR_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);
            addEatenFoodColumns.append(currentAttribute);

            String currentAttributeValue = eatenFoodMap.get(currentAttribute);
            //empty strings should not be sent to this method but if they are they are replaced with null
            if (currentAttributeValue != null && currentAttributeValue.equals(""))
            {
                currentAttributeValue = null;
            }

            if (varcharAttributes.contains(currentAttribute))
            {
                addEatenFoodValues.append("'").append(currentAttributeValue).append("'");
            } else
            {
                addEatenFoodValues.append(currentAttributeValue);
            }

            //if not at the last attribute put a comma to separate it from the next attribute
            if (count != supportedFoodAttributes.size() - 1)
            {
                addEatenFoodColumns.append(",");
                addEatenFoodValues.append(",");
            } else //last attribute added, stick a timestamp and id_user on the end
            {
                addEatenFoodColumns.append(",timestamp,id_user)");
                long UnixTimeLong = Long.parseLong(UnixTime);
                addEatenFoodValues.append(",").append("to_timestamp(").append(UnixTimeLong).append("),").append(id_user).append(")");
            }
        }

        addEatenFoodSQL.append(addEatenFoodColumns);
        addEatenFoodSQL.append(addEatenFoodValues);
        String addEatenFoodSQLString = addEatenFoodSQL.toString(); //finished SQL query
        log.debug(addEatenFoodSQLString);
        int returnValue = 0;
        System.out.println("DatabaseAccess: SQL query is:" + addEatenFoodSQLString);

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement addEatenFoodStatement = databaseConnection.prepareStatement(addEatenFoodSQLString);)
        {
            returnValue = addEatenFoodStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            System.out.println("SQL ERROR CODE " + ex.getSQLState());
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.debug("success:" + success);
        return success;
    }

    public static boolean removeEatenFood(String id_eatenfood)
    {
        log.trace("removeEatenFood()");
        log.debug(id_eatenfood);
        String removeeatenfoodSQL = "DELETE FROM eaten_foods_table WHERE id_eatenfood= ?";

        int returnValue = 0;
        System.out.println("DatabaseAccess: removeEatenFood() " + id_eatenfood);

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeEatenFoodStatement = databaseConnection.prepareStatement(removeeatenfoodSQL);)
        {
            removeEatenFoodStatement.setLong(1, Long.parseLong(id_eatenfood));
            returnValue = removeEatenFoodStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static List searchForFood(String food)
    {
        log.trace("searchForFood()");
        log.debug(food);
        String[] individualFoodWords = food.split(" ");

        //% indicates a wildcard
        StringBuilder searchForFoodSQL = new StringBuilder("SELECT * FROM searchable_foods_table WHERE foodname LIKE ").append("'").append(food).append("%'");

        if (individualFoodWords.length > 1)
        {
            for (String foodWord : individualFoodWords)
            {
                searchForFoodSQL.append(" UNION ");
                searchForFoodSQL.append(" SELECT * FROM searchable_foods_table WHERE foodname LIKE ").append("'").append(foodWord).append("%'");
            }
        }

        log.debug(searchForFoodSQL.toString());
        List resultSetList = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement searchForFood = databaseConnection.prepareStatement(searchForFoodSQL.toString());)
        {
            try (ResultSet resultSet = searchForFood.executeQuery();)
            {
                resultSetList = convertResultSetToList(resultSet);
                resultSetList = filterResults(resultSetList, food);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info("resultset: " + resultSetList.toString());
        return resultSetList;
    }

    private static boolean setupSelectedAttributes(String id_user)
    {
        log.trace("setupSelectedAttributes()");
        log.debug(id_user);
        String setupFoodAttributesSQL = "INSERT INTO food_attributes_table (id_user) VALUES (?)";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement setupFoodAttributesStatement = databaseConnection.prepareStatement(setupFoodAttributesSQL);)
        {
            setupFoodAttributesStatement.setLong(1, Long.parseLong(id_user));
            returnValue = setupFoodAttributesStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static boolean modifySelectedFoodAttributes(Map<String, Boolean> updatedFoodAttributesMap, String id_user)
    {
        log.trace("modifySelectedAttributes()");
        log.debug(id_user);
        log.debug(updatedFoodAttributesMap.toString());

        //create SQL query e.g
        //UPDATE viewable_attributes_table SET foodcode=?,foodname=?,foodnameoriginal=?,description=?,foodgroup=? WHERE id_user=?
        StringBuilder modifyFoodAttributesSQL = new StringBuilder();
        modifyFoodAttributesSQL.append("UPDATE food_attributes_table SET ");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);

            if (currentAttribute.equals("id_user"))
            {
                modifyFoodAttributesSQL.append(currentAttribute).append("=").append(id_user);
            } else
            {
                modifyFoodAttributesSQL.append(currentAttribute).append("=").append(updatedFoodAttributesMap.get(currentAttribute));
            }

            //if not at the last attribute put a comma to separate it from the next attribute
            if (count != supportedFoodAttributes.size() - 1)
            {
                modifyFoodAttributesSQL.append(",");
            }
        }
        modifyFoodAttributesSQL.append(" WHERE id_user=").append(id_user);
        String modifyFoodAttributesSQLString = modifyFoodAttributesSQL.toString();
        log.debug(modifyFoodAttributesSQLString);
        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement modifySelectedAttributesStatement = databaseConnection.prepareStatement(modifyFoodAttributesSQLString);)
        {

            returnValue = modifySelectedAttributesStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static Map<String, Boolean> getFoodAttributesList(String id_user)
    {
        log.trace("getFoodAttributesList()");
        log.debug(id_user);
        String getSelectedAttributesSQL = "SELECT * FROM food_attributes_table WHERE id_user = ?";

        Map<String, String> resultSetMap = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getSelectedAttributesListStatement = databaseConnection.prepareStatement(getSelectedAttributesSQL);)
        {
            getSelectedAttributesListStatement.setLong(1, Long.parseLong(id_user));
            try (ResultSet resultSet = getSelectedAttributesListStatement.executeQuery();)
            {
                resultSetMap = convertResultSetToMap(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info(resultSetMap.toString());
        
        //database outputs "t" and "f" in place of true and false so we replace these with boolean values
        Map<String, Boolean> outputMap = new HashMap<>();
        for (Map.Entry<String, String> entry : resultSetMap.entrySet())
        {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value.equals("t"))
            {
                outputMap.put(key, Boolean.TRUE);
            } else
            {
                outputMap.put(key, Boolean.FALSE);
            }
        }

        return outputMap;
    }

    private static boolean setupUserStats(String id_user)
    {
        log.trace("setupUserStats()");
        log.debug(id_user);
        String setupUserStatsSQL = "INSERT INTO user_stats_table (id_user, protein_goal, carbohydrate_goal, fat_goal, tee) VALUES (?,?,?,?,?)";

        String defaultProtein = "160";
        String defaultCarbohydrate = "200";
        String defaultFat = "80";
        String defaultTEE = "2160"; //calories
        long returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement setupUserStatsStatement = databaseConnection.prepareStatement(setupUserStatsSQL);)
        {
            setupUserStatsStatement.setLong(1, Long.parseLong(id_user));
            setupUserStatsStatement.setLong(2, Long.parseLong(defaultProtein));
            setupUserStatsStatement.setLong(3, Long.parseLong(defaultCarbohydrate));
            setupUserStatsStatement.setLong(4, Long.parseLong(defaultFat));
            setupUserStatsStatement.setLong(5, Long.parseLong(defaultTEE));

            returnValue = setupUserStatsStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static boolean modifyUserStats(Map<String, String> userStatsMap, String id_user)
    {
        log.trace("modifyUserStats()");
        log.debug(id_user);
        log.debug(userStatsMap.toString());

        //create SQL query e.g
        //UPDATE user_stats_table SET weight=?,height=?,protein_goal=?,carbohydrate_goal=?,fat_goal=? WHERE id_user=?
        StringBuilder modifyUserStatsSQL = new StringBuilder();
        modifyUserStatsSQL.append("UPDATE user_stats_table SET ");
        List<String> supportedUserStats = GlobalValues.getSUPPORTED_USER_STATS();
        for (int count = 0; count < supportedUserStats.size(); count++)
        {
            String currentStat = supportedUserStats.get(count);

            if (userStatsMap.get(currentStat) != null)
            {
                modifyUserStatsSQL.append(currentStat).append("=").append(userStatsMap.get(currentStat));
                modifyUserStatsSQL.append(",");

            }
        }

        //at end of list remove the trailing ","
        modifyUserStatsSQL.deleteCharAt(modifyUserStatsSQL.length() - 1);

        //complete SQL Query
        modifyUserStatsSQL.append(" WHERE id_user=").append(id_user);
        String modifyUserStatsSQLString = modifyUserStatsSQL.toString();
        log.debug(modifyUserStatsSQLString);
        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement modifyUserStatsStatement = databaseConnection.prepareStatement(modifyUserStatsSQLString))
        {
            returnValue = modifyUserStatsStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static Map getUserStats(String id_user)
    {
        log.trace("getUserStats()");
        log.debug(id_user);
        String getuserstatsSQL = "SELECT * FROM user_stats_table WHERE id_user = ?";

        Map resultSetMap = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
        {
            getUserStatsStatement.setLong(1, Long.parseLong(id_user));
            try (ResultSet resultSet = getUserStatsStatement.executeQuery();)
            {
                resultSetMap = convertResultSetToMap(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        log.info(resultSetMap.toString());
        return resultSetMap;
    }

    public static UUID createForgotPasswordRecord(String id_user, String email)
    {
        log.trace("createForgotPasswordRecord()");
        log.debug(email);
        log.debug(id_user);
        String forgotPasswordRecordSQL = "INSERT INTO forgot_passwords_table (id_user,identifier_token,expiry_date,email) VALUES (?,?,?,?)";

        //this is used to identify each password request
        UUID identifierToken = UUID.randomUUID();

        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiryTime = currentTime.plusMinutes(60);
        Timestamp expiryTimestamp = Timestamp.valueOf(expiryTime);

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement forgotPasswordStatement = databaseConnection.prepareStatement(forgotPasswordRecordSQL);)
        {
            forgotPasswordStatement.setLong(1, Long.parseLong(id_user));
            forgotPasswordStatement.setString(2, identifierToken.toString());
            forgotPasswordStatement.setTimestamp(3, expiryTimestamp);
            forgotPasswordStatement.setString(4, email);
            forgotPasswordStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info(identifierToken.toString());
        return identifierToken;
    }

    public static boolean validateForgotPasswordRequest(String identifierToken)
    {
        log.trace("validateForgotPasswordRequest()");
        log.debug(identifierToken);
        String validateForgotPasswordTokenSQL = "SELECT * FROM forgot_passwords_table WHERE identifier_token = ?";

        //check if identifierToken exists in database
        boolean output = false;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getForgotPasswordToken = databaseConnection.prepareStatement(validateForgotPasswordTokenSQL);)
        {
            getForgotPasswordToken.setString(1, identifierToken);

            try (ResultSet resultSet = getForgotPasswordToken.executeQuery();)
            {
                //if token exists check if it is expired
                if (!resultSet.next())
                {
                    log.info("token does not exist");
                    return output;
                }

                Timestamp expiryTimestamp = resultSet.getTimestamp("expiry_date");
                LocalDateTime expiry = expiryTimestamp.toLocalDateTime();

                if (LocalDateTime.now().isBefore(expiry))
                {
                    log.info("token is valid");
                    output = true; //token is valid
                    return output;
                } else
                {
                    log.info("token has expired");
                    return output;
                }
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info(String.valueOf(output));
        return output;
    }

    public static void removeExpiredTokens()
    {
        log.trace("removeExpiredTokens()");
        String removeExpiredTokensSQL = "DELETE FROM forgot_passwords_table WHERE expiry_date < ?";

        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiryTime = currentTime.minusMinutes(10); //tokens last 10 minutes
        Timestamp expiryTimestamp = Timestamp.valueOf(expiryTime);

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeTokensStatement = databaseConnection.prepareStatement(removeExpiredTokensSQL);)
        {
            removeTokensStatement.setTimestamp(1, expiryTimestamp);
            removeTokensStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
    }

    public static boolean removeToken(String identifierToken)
    {
        log.trace("removeToken()");
        log.debug(identifierToken);
        String removeExpiredTokensSQL = "DELETE FROM forgot_passwords_table WHERE identifier_token = ?";

        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeTokenStatement = databaseConnection.prepareStatement(removeExpiredTokensSQL);)
        {
            removeTokenStatement.setString(1, identifierToken);
            returnValue = removeTokenStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static String getIdentifierTokenEmail(String identifierToken)
    {
        log.trace("getIdentifierTokenEmail()");
        log.debug(identifierToken);
        String getIdentifierTokenEmailSQL = "SELECT email FROM forgot_passwords_table WHERE identifier_token = ?";

        String email = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getIdentifierTokenEmailSQL);)
        {
            getEmailStatement.setString(1, identifierToken);
            try (ResultSet resultSet = getEmailStatement.executeQuery();)
            {
                if (resultSet.next())
                {
                    email = resultSet.getString("email");
                }
            }
        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        log.info("email linked to token:" + email);
        return email;
    }

    public static boolean changePasswordByEmail(String email, String password)
    {
        log.trace("changePasswordByEmail()");
        log.debug(email);
        log.debug(password);
        String changePasswordSQL = "UPDATE user_table SET password =? WHERE email=?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement changePasswordStatement = databaseConnection.prepareStatement(changePasswordSQL);)
        {
            changePasswordStatement.setString(1, password);
            changePasswordStatement.setString(2, email);
            returnValue = changePasswordStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static boolean changePassword(String id_user, String password)
    {
        log.trace("changePassword()");
        log.debug(id_user);
        log.debug(password);
        String changePasswordSQL = "UPDATE user_table SET password =? WHERE id_user=?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement changePasswordStatement = databaseConnection.prepareStatement(changePasswordSQL);)
        {
            changePasswordStatement.setString(1, password);
            changePasswordStatement.setLong(2, Long.parseLong(id_user));
            returnValue = changePasswordStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static boolean changeEmail(String newEmail, String id_user)
    {
        log.trace("changeEmail()");
        log.debug(id_user);
        log.debug(newEmail);
        String changeEmailSQL = "UPDATE user_table SET email =? WHERE id_user=?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement changeEmailStatement = databaseConnection.prepareStatement(changeEmailSQL);)
        {
            changeEmailStatement.setString(1, newEmail);
            changeEmailStatement.setLong(2, Long.parseLong(id_user));
            returnValue = changeEmailStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

    public static boolean deleteAccount(String id_user)
    {
        log.trace("deleteAccount()");
        log.debug(id_user);
        String deleteAccountSQL = "DELETE FROM user_table WHERE id_user = ?";
        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement deleteAccountStatement = databaseConnection.prepareStatement(deleteAccountSQL);)
        {
            deleteAccountStatement.setLong(1, Long.parseLong(id_user));
            returnValue = deleteAccountStatement.executeUpdate();

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        //a value of 0 would mean nothing was modified so the query failed and false is returned
        boolean success = (returnValue != 0);
        log.info("success:" + success);
        return success;
    }

}
