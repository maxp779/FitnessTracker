/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.controllerservlets;

import com.fitnesstracker.core.ServletUtils;
import com.fitnesstracker.core.UserObject;
import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.serverAPI.ErrorCode;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.UUID;
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
@WebServlet(name = "RemoveEatenFoodServlet", urlPatterns =
{
    "/RemoveEatenFoodServlet"
})
public class RemoveEatenFoodServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(RemoveEatenFoodServlet.class);

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
        Map<String, String> foodToRemove = ServletUtils.convertJSONStringToMap(JSONString);
        UserObject currentUser = ServletUtils.getCurrentUser(request);
        UUID foodUuid = UUID.fromString(foodToRemove.get("foodUuid"));

        //execute database command and send response to client
        boolean success = DatabaseAccess.removeEatenFood(foodUuid, currentUser.getUserId());
        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(success);
        if (success)
        {
            outputObject.setData(foodToRemove);
            writeOutput(response, outputObject);
        } else
        {
            outputObject.setErrorCode(ErrorCode.REMOVE_EATEN_FOOD_FAILED);
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
