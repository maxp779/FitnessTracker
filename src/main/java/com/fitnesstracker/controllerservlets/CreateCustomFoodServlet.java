/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.controllerservlets;

import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.core.ServletUtilities;
import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.core.UserObject;
import com.fitnesstracker.database.DatabaseAccess;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
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
@WebServlet(name = "CreateCustomFoodServlet", urlPatterns =
{
    "/CreateCustomFoodServlet"
})
public class CreateCustomFoodServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(CreateCustomFoodServlet.class);

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
        String requestDetails = ServletUtilities.getPOSTRequestJSONString(request);
                log.debug("requestDetails:"+requestDetails);
        Map<String, String> customFoodMap = ServletUtilities.convertJSONStringToMap(requestDetails);
        
        
        
       // Map<String, String> customFoodMap = ServletUtilities.convertJSONFormDataToMap(requestDetails);
        UserObject currentUser = ServletUtilities.getCurrentUser(request);
        
        boolean success = false;
        try
        {
            success = DatabaseAccess.createCustomFood(customFoodMap, currentUser.getId_user());
        } catch (SQLException ex)
        {
            log.error("DatabaseAccess.createCustomFood failed", ex);
        }

        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(success);

        if (success)
        {
            log.info("custom food created successfully");
            outputObject.setData(customFoodMap);
            writeOutput(response, outputObject);
        } else
        {
            outputObject.setErrorCode(ErrorCode.ADD_CUSTOM_FOOD_FAILED);
            writeOutput(response, outputObject);
        }
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
