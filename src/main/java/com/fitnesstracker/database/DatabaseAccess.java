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
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
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
        String getCredentialsFromEmailSql = "SELECT email,password,user_id FROM users_table WHERE email = ?";

        String retrievedEmail = null;
        String retrievedPassword = null;
        String retrievedUserId = null;
        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckEmail(loginAttemptEmail))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getCredentialsFromEmailSql);)
            {
                getEmailStatement.setString(1, loginAttemptEmail);
                try (ResultSet resultSet = getEmailStatement.executeQuery())
                {
                    if (resultSet.next())
                    {
                        retrievedEmail = resultSet.getString("email");
                        retrievedPassword = resultSet.getString("password");
                        retrievedUserId = resultSet.getString("user_id");
                    }
                }

            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }

            Map<String, String> outputMap = new HashMap<>();
            outputMap.put("email", retrievedEmail);
            outputMap.put("password", retrievedPassword);
            outputMap.put("userId", retrievedUserId);
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
        String getStoredPasswordSql = "SELECT password FROM users_table WHERE userId = ?";

        String hashedPassword = null;
        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckUserId(userObject.getUserId()))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getStoredPasswordSql);)
            {
                getEmailStatement.setLong(1, Long.parseLong(userObject.getUserId()));

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

    public static Map<String, String> getUserCredentialsFromUserId(String userId)
    {
        log.trace("getUserCredentialsFromUserId()");
        log.debug(userId);
        String getCredentialsFromUserIdSql = "SELECT email,password,user_id FROM users_table WHERE user_id = ?";

        String retrievedEmail = null;
        String retrievedPassword = null;
        String retrievedUserId = null;

        //if user exists
        if (DatabaseAccess.userAlreadyExistsCheckUserId(userId))
        {
            try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                    PreparedStatement getEmailStatement = databaseConnection.prepareStatement(getCredentialsFromUserIdSql);)
            {
                getEmailStatement.setLong(1, Long.parseLong(userId));

                try (ResultSet resultSet = getEmailStatement.executeQuery();)
                {
                    resultSet.next();
                    retrievedEmail = resultSet.getString("email");
                    retrievedPassword = resultSet.getString("password");
                    retrievedUserId = resultSet.getString("user_id");
                }

            } catch (SQLException ex)
            {
                log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
            }
            Map outputMap = new HashMap<>();
            outputMap.put("email", retrievedEmail);
            outputMap.put("hashedPassword", retrievedPassword);
            outputMap.put("userId", retrievedUserId);
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
        String adduserSQL = "INSERT INTO users_table (email,password) VALUES (?,?)";
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
                    String user_id = getUserId(anEmail);
                    setupSelectedAttributes(user_id);
                    setupUserStats(user_id);
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
        String checkforuseremailSQL = "SELECT email FROM users_table WHERE email = ?";

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

    public static boolean userAlreadyExistsCheckUserId(String userId)
    {
        log.trace("userAlreadyExistsCheckUserId()");
        log.debug(userId);
        String checkforUserIdSql = "SELECT user_id FROM users_table WHERE user_id = ?";

        boolean userAlreadyExists = true;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement checkUserStatement = databaseConnection.prepareStatement(checkforUserIdSql);)
        {
            checkUserStatement.setLong(1, Long.parseLong(userId));

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

    public static String getUserId(String anEmail)
    {
        log.trace("getUserId()");
        log.debug(anEmail);
        String getUserIdSql = "SELECT user_id FROM users_table WHERE email = ?";

        Long userId = null;
        String userIdString = null;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getuserIDStatement = databaseConnection.prepareStatement(getUserIdSql);)
        {
            getuserIDStatement.setString(1, anEmail);

            try (ResultSet resultSet = getuserIDStatement.executeQuery();)
            {
                if (resultSet.next())
                {
                    userId = resultSet.getLong(1);
                    userIdString = userId.toString();
                }
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug(userIdString);
        return userIdString;
    }

    public static List getCustomFoodList(String userId)
    {
        log.trace("getCustomFoodList()");
        log.debug(userId);
        String getCustomFoodListSql = "SELECT * FROM custom_foods_table WHERE user_id = ?";

        List resultSetList = null;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getCustomFoodListStatement = databaseConnection.prepareStatement(getCustomFoodListSql);)
        {
            getCustomFoodListStatement.setLong(1, Long.parseLong(userId));
            try (ResultSet resultSet = getCustomFoodListStatement.executeQuery();)
            {
                resultSetList = DatabaseHelpers.convertResultSetToList(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.debug("resultset: " + resultSetList.toString());
        return resultSetList;
    }

    public static boolean deleteCustomFood(UUID foodUuid, String userId)
    {
        log.trace("deleteCustomFood()");
        log.debug("foodUuid:" + foodUuid.toString());

        String removeCustomFoodSql = "DELETE FROM custom_foods_table WHERE food_uuid= ? AND user_id = ?";

        int returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeCustomFoodStatement = databaseConnection.prepareStatement(removeCustomFoodSql);)
        {
            removeCustomFoodStatement.setObject(1, foodUuid);
            removeCustomFoodStatement.setLong(2, Long.parseLong(userId));
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

    /**
     * createCustomFood() creates an SQL query dynamically with a StringBuilder
     * object the reason for this is to allow for support for more custom food
     * attributes in the future without too much hassle.
     *
     * example query: INSERT INTO custom_foods_table
     * (userId,foodname,protein,carbohydrate,fat,calorie) VALUES
     * (100,"oats",15,30,12,400)
     *
     * The query is built in 3 parts The first part is always "INSERT INTO
     * custom_foods_table " The second part is "(colunm1,column2)" based on the
     * attribute names provided by the client The third part is
     * "(value1,column2)" based on the attribute values provided by the client
     * At the end they are concatanated together to form a full SQL query
     *
     * @param customFoodMap a map object representing a new custom food
     * @param userId the identifier for the current user
     * @return a boolean indicating whether the custom food was added
     * successfully or not
     * @throws java.sql.SQLException
     */
    public static boolean createCustomFood(Map<String, String> customFoodMap, String userId) throws SQLException
    {
        log.trace("createCustomFood()");
        log.debug(userId);
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
            } else //userId is not part of supportedFoodAttributeList and cannot be treated the same so it is added manually here
            {
                addCustomFoodColumns.append(",user_id,food_uuid)");
                UUID foodUuid = DatabaseHelpers.generateUuid();
                addCustomFoodValues.append(",").append(userId).append(",").append("'" + foodUuid + "'").append(")");
            }
        }

        addCustomFoodSQL.append(addCustomFoodColumns);
        addCustomFoodSQL.append(addCustomFoodValues);
        String addCustomFoodSQLString = addCustomFoodSQL.toString(); //finished SQL query
        log.debug("createCustomFood() SQL query is:" + addCustomFoodSQLString);
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
     * foodname=?,protein=?,carbohydrate=?,fat=?,calorie=? WHERE food_uuid=?"
     *
     *
     * @param customFoodMap a Map containing attribute values for a particular
     * custom food that is to be updated
     * @param userId the identifier for the current user
     * @return a boolean indicating whether the custom food was added
     * successfully or not
     */
    public static boolean editCustomFood(Map<String, String> customFoodMap, String userId)
    {
        log.trace("editCustomFood()");
        log.debug(userId);
        log.debug(customFoodMap.toString());
        StringBuilder editCustomFoodSQL = new StringBuilder();
        editCustomFoodSQL.append("UPDATE custom_foods_table SET ");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        List<String> varcharAttributes = GlobalValues.getVARCHAR_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);

            if (!"user_id".equals(currentAttribute))
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
                editCustomFoodSQL.append(",user_id=").append(userId);
                editCustomFoodSQL.append(" WHERE food_uuid=").append(customFoodMap.get("foodUuid")).append(" AND user_id =").append(userId);
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

    public static List getEatenFoodList(String userId, LocalDateTime inputTime)
    {
        log.trace("getEatenFoodList()");
        log.debug(userId);
        log.debug(inputTime.toString());
        String getfoodeatenlistSQL = "SELECT * FROM eaten_foods_table WHERE user_id = ? AND timestamp >= ? AND timestamp < ?";

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
            getFoodEatenStatement.setLong(1, Long.parseLong(userId));
            getFoodEatenStatement.setTimestamp(2, currentDayStartTimestamp);
            getFoodEatenStatement.setTimestamp(3, nextDayStartTimestamp);
            try (ResultSet resultSet = getFoodEatenStatement.executeQuery();)
            {
                resultSetList = DatabaseHelpers.convertResultSetToList(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info("resultset: " + "resultset: " + resultSetList.toString());
        return resultSetList;
    }

    public static boolean addEatenFood(Map<String, String> eatenFoodMap, String userId)
    {
        log.trace("addEatenFood()");
        log.debug("usedId:" + userId);
        log.debug(eatenFoodMap.toString());

        //create SQL query e.g
        //INSERT INTO eaten_foods_table (user_id,foodname,protein,carbohydrate,fat,calorie,timestamp) VALUES (?,?,?,?,?,?,?)
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
            } else //last attribute added, stick a timestamp and user_id on the end
            {
                addEatenFoodColumns.append(",timestamp,user_id,food_uuid)");
                long UnixTimeLong = Long.parseLong(eatenFoodMap.get("unixTime"));
                UUID foodUuid = DatabaseHelpers.generateUuid();
                addEatenFoodValues.append(",to_timestamp(").append(UnixTimeLong).append("),").append(userId).append(",").append("'" + foodUuid + "'").append(")");
            }
        }

        addEatenFoodSQL.append(addEatenFoodColumns);
        addEatenFoodSQL.append(addEatenFoodValues);
        String addEatenFoodSQLString = addEatenFoodSQL.toString(); //finished SQL query
        log.debug("addEatenFood() SQL query is:" + addEatenFoodSQLString);
        int returnValue = 0;

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

    public static boolean removeEatenFood(UUID foodUuid, String userId)
    {
        log.trace("removeEatenFood()");
        log.debug("userId:" + userId);
        log.debug("foodUuid:" + foodUuid);
        String removeeatenfoodSQL = "DELETE FROM eaten_foods_table WHERE food_uuid= ? AND user_id = ?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement removeEatenFoodStatement = databaseConnection.prepareStatement(removeeatenfoodSQL);)
        {
            removeEatenFoodStatement.setObject(1, foodUuid);
            removeEatenFoodStatement.setLong(2, Long.parseLong(userId));

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
                resultSetList = DatabaseHelpers.convertResultSetToList(resultSet);
                resultSetList = DatabaseHelpers.filterResults(resultSetList, food);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }
        log.info("resultset: " + resultSetList.toString());
        return resultSetList;
    }

    private static boolean setupSelectedAttributes(String userId)
    {
        log.trace("setupSelectedAttributes()");
        log.debug(userId);
        String setupFoodAttributesSQL = "INSERT INTO food_attributes_table (user_id) VALUES (?)";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement setupFoodAttributesStatement = databaseConnection.prepareStatement(setupFoodAttributesSQL);)
        {
            setupFoodAttributesStatement.setLong(1, Long.parseLong(userId));
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

    public static boolean modifySelectedFoodAttributes(Map<String, Boolean> updatedFoodAttributesMap, String userId)
    {
        log.trace("modifySelectedAttributes()");
        log.debug(userId);
        log.debug(updatedFoodAttributesMap.toString());

        //create SQL query e.g
        //UPDATE viewable_attributes_table SET foodcode=?,foodname=?,foodnameoriginal=?,description=?,foodgroup=? WHERE user_id=?
        StringBuilder modifyFoodAttributesSQL = new StringBuilder();
        modifyFoodAttributesSQL.append("UPDATE food_attributes_table SET ");
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_ATTRIBUTES();
        for (int count = 0; count < supportedFoodAttributes.size(); count++)
        {
            String currentAttribute = supportedFoodAttributes.get(count);

            if (currentAttribute.equals("user_id"))
            {
                modifyFoodAttributesSQL.append(currentAttribute).append("=").append(userId);
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
        modifyFoodAttributesSQL.append(" WHERE user_id=").append(userId);
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

    public static Map<String, Boolean> getFoodAttributesList(String userId)
    {
        log.trace("getFoodAttributesList()");
        log.debug(userId);
        String getSelectedAttributesSQL = "SELECT * FROM food_attributes_table WHERE user_id = ?";

        Map<String, String> resultSetMap = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getSelectedAttributesListStatement = databaseConnection.prepareStatement(getSelectedAttributesSQL);)
        {
            getSelectedAttributesListStatement.setLong(1, Long.parseLong(userId));
            try (ResultSet resultSet = getSelectedAttributesListStatement.executeQuery();)
            {
                resultSetMap = DatabaseHelpers.convertResultSetToMap(resultSet);
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

    private static boolean setupUserStats(String userId)
    {
        log.trace("setupUserStats()");
        log.debug(userId);
        String setupUserStatsSQL = "INSERT INTO users_stats_table (user_id, protein_goal, carbohydrate_goal, fat_goal, tee) VALUES (?,?,?,?,?)";

        String defaultProtein = "160";
        String defaultCarbohydrate = "200";
        String defaultFat = "80";
        String defaultTEE = "2160"; //calories
        long returnValue = 0;
        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement setupUserStatsStatement = databaseConnection.prepareStatement(setupUserStatsSQL);)
        {
            setupUserStatsStatement.setLong(1, Long.parseLong(userId));
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

    public static boolean modifyUserStats(Map<String, String> userStatsMap, String userId)
    {
        log.trace("modifyUserStats()");
        log.debug(userId);
        log.debug(userStatsMap.toString());

        //create SQL query e.g
        //UPDATE users_stats_table SET weight=?,height=?,protein_goal=?,carbohydrate_goal=?,fat_goal=? WHERE user_id=?
        StringBuilder modifyUserStatsSQL = new StringBuilder();
        modifyUserStatsSQL.append("UPDATE users_stats_table SET ");
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
        modifyUserStatsSQL.append(" WHERE user_id=").append(userId);
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

    public static Map getUserStats(String userId)
    {
        log.trace("getUserStats()");
        log.debug(userId);
        String getuserstatsSQL = "SELECT * FROM users_stats_table WHERE user_id = ?";

        Map resultSetMap = null;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
        {
            getUserStatsStatement.setLong(1, Long.parseLong(userId));
            try (ResultSet resultSet = getUserStatsStatement.executeQuery();)
            {
                resultSetMap = DatabaseHelpers.convertResultSetToMap(resultSet);
            }

        } catch (SQLException ex)
        {
            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
        }

        log.info(resultSetMap.toString());
        return resultSetMap;
    }

    public static UUID createForgotPasswordRecord(String userId, String email)
    {
        log.trace("createForgotPasswordRecord()");
        log.debug(email);
        log.debug(userId);
        String forgotPasswordRecordSQL = "INSERT INTO forgot_passwords_table (user_id, identifier_token, expiry_date, email) VALUES (?,?,?,?)";

        //this is used to identify each password request
        UUID identifierToken = UUID.randomUUID();

        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiryTime = currentTime.plusMinutes(60);
        Timestamp expiryTimestamp = Timestamp.valueOf(expiryTime);

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement forgotPasswordStatement = databaseConnection.prepareStatement(forgotPasswordRecordSQL);)
        {
            forgotPasswordStatement.setLong(1, Long.parseLong(userId));
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
        String changePasswordSQL = "UPDATE users_table SET password =? WHERE email=?";

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

    public static boolean changePassword(String userId, String password)
    {
        log.trace("changePassword()");
        log.debug(userId);
        log.debug(password);
        String changePasswordSQL = "UPDATE users_table SET password =? WHERE user_id=?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement changePasswordStatement = databaseConnection.prepareStatement(changePasswordSQL);)
        {
            changePasswordStatement.setString(1, password);
            changePasswordStatement.setLong(2, Long.parseLong(userId));
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

    public static boolean changeEmail(String newEmail, String userId)
    {
        log.trace("changeEmail()");
        log.debug(userId);
        log.debug(newEmail);
        String changeEmailSQL = "UPDATE users_table SET email =? WHERE user_id=?";

        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement changeEmailStatement = databaseConnection.prepareStatement(changeEmailSQL);)
        {
            changeEmailStatement.setString(1, newEmail);
            changeEmailStatement.setLong(2, Long.parseLong(userId));
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

    public static boolean deleteAccount(String userId)
    {
        log.trace("deleteAccount()");
        log.debug(userId);
        String deleteAccountSQL = "DELETE FROM users_table WHERE user_id = ?";
        int returnValue = 0;

        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
                PreparedStatement deleteAccountStatement = databaseConnection.prepareStatement(deleteAccountSQL);)
        {
            deleteAccountStatement.setLong(1, Long.parseLong(userId));
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

  

//    private static long getEatenFoodCount(String userId)
//    {
//        log.trace("getEatenFoodCount()");
//        log.debug(userId);
//        String getuserstatsSQL = "SELECT eaten_food_count FROM users_stats_table WHERE user_id = ?";
//
//        long eaten_food_count = -1;
//
//        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
//                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
//        {
//            getUserStatsStatement.setLong(1, Long.parseLong(userId));
//            try (ResultSet resultSet = getUserStatsStatement.executeQuery();)
//            {
//                resultSet.next();
//                eaten_food_count = resultSet.getLong("eaten_food_count");
//            }
//
//        } catch (SQLException ex)
//        {
//            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
//        }
//
//        log.info("eaten_food_count:" + eaten_food_count);
//        return eaten_food_count;
//    }
//    private static long getCustomFoodCount(String userId)
//    {
//        log.trace("getCustomFoodCount()");
//        log.debug(userId);
//        String getuserstatsSQL = "SELECT custom_food_count FROM users_stats_table WHERE user_id = ?";
//
//        long custom_food_count = -1;
//
//        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
//                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
//        {
//            getUserStatsStatement.setLong(1, Long.parseLong(userId));
//            try (ResultSet resultSet = getUserStatsStatement.executeQuery();)
//            {
//                resultSet.next();
//                custom_food_count = resultSet.getLong("custom_food_count");
//            }
//
//        } catch (SQLException ex)
//        {
//            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
//        }
//
//        log.info("custom_food_count:" + custom_food_count);
//        return custom_food_count;
//    }
//    private static boolean incrementCustomFoodCount(String userId)
//    {
//        log.trace("incrementCustomFoodCount()");
//        log.debug(userId);
//        String getuserstatsSQL = "UPDATE users_stats_table SET custom_food_count = custom_food_count + 1 WHERE user_id = ?";
//
//        int output = 0;
//        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
//                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
//        {
//            getUserStatsStatement.setLong(1, Long.parseLong(userId));
//            output = getUserStatsStatement.executeUpdate();
//
//        } catch (SQLException ex)
//        {
//            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
//        }
//
//        return output != 0;
//    }
//
//    private static boolean incrementEatenFoodCount(String userId)
//    {
//        log.trace("incrementEatenFoodCount()");
//        log.debug(userId);
//        String getuserstatsSQL = "UPDATE users_stats_table SET eaten_food_count = eaten_food_count + 1 WHERE user_id = ?";
//
//        int output = 0;
//        try (Connection databaseConnection = DatabaseUtils.getDatabaseConnection();
//                PreparedStatement getUserStatsStatement = databaseConnection.prepareStatement(getuserstatsSQL);)
//        {
//            getUserStatsStatement.setLong(1, Long.parseLong(userId));
//            output = getUserStatsStatement.executeUpdate();
//
//        } catch (SQLException ex)
//        {
//            log.error(ErrorCode.DATABASE_ERROR.toString(), ex);
//        }
//
//        return output != 0;
//    }
    }
