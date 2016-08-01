/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.controllerservlets;

import com.fitnesstracker.core.ServletUtilities;
import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.serverAPI.ErrorCode;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
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
@WebServlet(name = "GetIdentifierTokenEmailServlet", urlPatterns =
{
    "/GetIdentifierTokenEmailServlet"
})
public class GetIdentifierTokenEmailServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(GetIdentifierTokenEmailServlet.class);

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
//        String queryString = request.getQueryString();
//        Map<String,String> queryStringMap = ServletUtilities.convertJSONStringToMap(queryString);
        //String requestDetails = ServletUtilities.getPOSTRequestJSONString(request);
        String identifierToken = request.getParameter("identifierToken");

        String email = DatabaseAccess.getIdentifierTokenEmail(identifierToken);
        log.debug("email:" + email);
        log.debug("identifierToken:" + identifierToken);

        boolean success = (email != null);
        log.debug("email found:" + success);
        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(success);
        if (success)
        {
            Map<String, String> outputMap = new HashMap<>();
            outputMap.put("email", email);
            outputObject.setData(outputMap);
            writeOutput(response, outputObject);
        } else
        {
            outputObject.setErrorCode(ErrorCode.FORGOT_PASSWORD_TOKEN_EXPIRED_OR_ALREADY_USED);
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
