/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.database.DatabaseAccess;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This Servlet handles user authentication, it is called when the user has
 * filled in and submitted their details on either the desktop or mobile login
 * pages. This servlet then checks their account credentials and redirects them
 * accordingly.
 *
 * @author max
 */
@WebServlet(name = "AuthenticationServlet", urlPatterns =
{
    "/AuthenticationServlet/*"
})
public class AuthenticationServlet extends HttpServlet
{
    private static final Logger log = LoggerFactory.getLogger(AuthenticationServlet.class);

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException
    {
        log.trace("doPost()");
        String loginDetailsJSON = ServletUtilities.getPOSTRequestJSONString(request);
        Map<String, String> loginDetailsMap = ServletUtilities.convertJSONFormDataToMap(loginDetailsJSON);
        
        String loginEmail = loginDetailsMap.get("email");
        Map<String,String> userCredentials = DatabaseAccess.getUserCredentialsFromEmail(loginEmail);
        StandardOutputObject outputObject = new StandardOutputObject();
        if (userCredentials == null)
        {
            log.trace("account dosent exist");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.AUTHENTICATION_FAILED);
            writeOutput(response, outputObject);
            return;
        }
        
        String storedPassword = userCredentials.get("password");
        String loginPassword = loginDetailsMap.get("password");
        if (!PasswordEncoder.passwordMatch(loginPassword, storedPassword))
        {
            log.trace("password incorrect");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.AUTHENTICATION_FAILED);
            writeOutput(response, outputObject);

        } else
        {
            log.trace("password correct");     
            createNewSession(request, userCredentials);
            outputObject.setSuccess(true);
            writeOutput(response, outputObject);
        }

    }

    private void writeOutput(HttpServletResponse response, StandardOutputObject outputObject)
    {
        log.trace("writeOutput()");
        String outputJSON = outputObject.getJSONString();
        log.debug(outputJSON);
        try (PrintWriter out = response.getWriter())
        {
            out.write(outputJSON);
        } catch (IOException ex)
        {
            log.error(ErrorCode.SENDING_CLIENT_DATA_FAILED.toString(), ex);
        }
    }

    private void createNewSession(HttpServletRequest request, Map<String,String> userCredentials)
    {
        log.trace("createNewSession()");
        HttpSession session = request.getSession(true);
        UserObject user = new UserObject();
        user.setEmail(userCredentials.get("email"));
        user.setId_user(userCredentials.get("id_user"));
        session.setAttribute("user", user);
        session.setMaxInactiveInterval(GlobalValues.getSESSION_TIMEOUT_VALUE());
        log.debug("new session created for: "+ user.toString());
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
