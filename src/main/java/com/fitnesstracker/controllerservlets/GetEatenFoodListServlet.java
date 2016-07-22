/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.controllerservlets;

import com.fitnesstracker.core.ServletUtilities;
import com.fitnesstracker.core.StandardOutputObject;
import com.fitnesstracker.core.UserObject;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.serverAPI.ErrorCode;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
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
@WebServlet(name = "GetEatenFoodListServlet", urlPatterns =
{
    "/GetEatenFoodListServlet"
})
public class GetEatenFoodListServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(GetEatenFoodListServlet.class);

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        log.trace("doGet()");

        //format query string correctly so it can be a valid JSON
        //String queryString = request.getQueryString();
        String UnixTime = request.getParameter("UnixTime");
        log.debug("UnixTime:" + UnixTime);
        
        LocalDateTime inputTime = LocalDateTime.ofEpochSecond(Long.parseLong(UnixTime), 0, ZoneOffset.UTC);
        UserObject currentUser = ServletUtilities.getCurrentUser(request);
        System.out.println("Getting eaten foods for user " + currentUser.getId_user() + " for date " + inputTime.toString() + " Unix time:" + UnixTime);

        List eatenFoodList = DatabaseAccess.getEatenFoodList(currentUser.getId_user(), inputTime);
        StandardOutputObject outputObject = new StandardOutputObject();
        boolean success = (eatenFoodList != null);
        outputObject.setSuccess(success);

        if (success)
        {
            outputObject.setData(eatenFoodList);
            writeOutput(response, outputObject);

        } else
        {
            outputObject.setErrorCode(ErrorCode.GET_EATEN_FOOD_LIST_FAILED);
            writeOutput(response, outputObject);
        }
    }

    private void writeOutput(HttpServletResponse response, StandardOutputObject outputObject)
    {
        log.trace("writeOutput()");
        response.setContentType("application/json");
        String outputJSON = outputObject.getJSONString();
        log.debug(outputJSON);
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
