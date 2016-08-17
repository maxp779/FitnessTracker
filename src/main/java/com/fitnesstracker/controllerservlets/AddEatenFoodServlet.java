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
import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.standardobjects.StandardFoodObject;
import java.io.IOException;
import java.io.PrintWriter;
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
@WebServlet(name = "AddEatenFoodServlet", urlPatterns =
{
    "/AddEatenFoodServlet"
})
public class AddEatenFoodServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(AddEatenFoodServlet.class);

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
        String eatenFoodJSONString = ServletUtils.getPOSTRequestJSONString(request);
        //Map<String, String> eatenFoodMap = ServletUtils.convertJSONStringToMap(eatenFoodJSONString);
        StandardFoodObject foodObject = ServletUtils.deserializeFoodJson(eatenFoodJSONString);
        log.trace("doPost() eaten food to be added:"+foodObject.toString());
        UserObject currentUser = ServletUtils.getCurrentUser(request);        
        
        boolean success = DatabaseAccess.addEatenFood(foodObject.getAsSingleMap(), currentUser.getUserId());
        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(success);
        if (success)
        {
            log.info("eaten food added successfully");
            //outputObject.setData(eatenFoodJSONString); dont think this is needed tbh, client should know what food was sent to be added
            writeOutput(response, outputObject);
        } else
        {
            outputObject.setErrorCode(ErrorCode.ADD_EATEN_FOOD_FAILED);
            writeOutput(response, outputObject);
        }
    }

    private void writeOutput(HttpServletResponse response, StandardOutputObject output)
    {
        log.trace("writeOutput()");
        String outputJSON = output.getJSONString();
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
