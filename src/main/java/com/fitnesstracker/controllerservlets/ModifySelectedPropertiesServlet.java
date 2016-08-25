/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.controllerservlets;

import com.fitnesstracker.core.ServletUtils;
import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.core.UserObject;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.serverAPI.ErrorCode;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
@WebServlet(name = "ModifySelectedPropertiesServlet", urlPatterns =
{
    "/ModifySelectedPropertiesServlet"
})
public class ModifySelectedPropertiesServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(ModifySelectedPropertiesServlet.class);

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        log.trace("doPost()");
        String JSONString = ServletUtils.getPOSTRequestJSONString(request);
        log.debug(JSONString);
        Map<String, String> clientSelectedPropertiesMap = ServletUtils.convertJSONStringToMap(JSONString);
        UserObject currentUser = ServletUtils.getCurrentUser(request);

        //selectedAttributesMap.put("id_user", id_user); <-- not sure why this is needed, likely redundant now
        log.debug("current user: " + currentUser.toString());
        
        Map<String, Boolean> updatedSelectedPropertiesMap = createUpdatedAttributesMap(clientSelectedPropertiesMap);
        boolean success = DatabaseAccess.modifySelectedFoodAttributes(updatedSelectedPropertiesMap, currentUser.getUserId());
        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(success);

        if (success)
        {
            outputObject.setData(updatedSelectedPropertiesMap);
            writeOutput(response, outputObject);
        } else
        {

            outputObject.setErrorCode(ErrorCode.UPDATE_SELECTED_PROPERTIES_FAILED);
            writeOutput(response, outputObject);
        }
    }
    
    /**
     * This method ensures that the Map object sent to the database method is populated with
     * every attribute and each attribute has a true/false value. It also converts the true/false
     * Strings to Boolean values.
     * 
     * This ensures that if the client misses some attributes for any reason or decided to only
     * send attributes that are changed that the database will not end up in an inconsistent state e.g
     * with null values instead of false.
     * 
     * @param inputMap The map send from the client
     * @return a map ready to be sent to the database to modify the users selected food attributes
     */
    private Map<String,Boolean> createUpdatedAttributesMap(Map<String, String> inputMap)
    {
        Map<String, Boolean> updatedAttributesMap = new HashMap<>();
        List<String> supportedFoodAttributes = GlobalValues.getSUPPORTED_FOOD_PROPERTIES();

        for (String foodAttribute : supportedFoodAttributes)
        {                  
            //if map client sent contains the key, check its value
            if (inputMap.containsKey(foodAttribute))
            {
                if(inputMap.get(foodAttribute).equals("true"))
                {
                    updatedAttributesMap.put(foodAttribute, Boolean.TRUE);
                }
                else
                {
                    updatedAttributesMap.put(foodAttribute, Boolean.FALSE);
                }
            } else
            {
                //if map client sent does not contain the key, add it and set to false
                updatedAttributesMap.put(foodAttribute, Boolean.FALSE);
            }
        }

        return updatedAttributesMap;
    }

    private void writeOutput(HttpServletResponse response, StandardOutputObject outputObject)
    {
        log.trace("writeOutput()");
        String outputJSON = outputObject.getJSONString();
        log.debug(outputJSON);
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter())
        {
            out.print(outputJSON);
        } catch (IOException ex)
        {
            log.error(ErrorCode.SENDING_CLIENT_DATA_FAILED.toString(), ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo()
    {
        return "Short description";
    }// </editor-fold>

}
