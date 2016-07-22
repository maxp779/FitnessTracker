/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.globalvalues.GlobalValues;
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
@WebServlet(name = "CreateAccountServlet", urlPatterns =
{
    "/CreateAccountServlet"
})
public class CreateAccountServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(CreateAccountServlet.class);

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
        String accountDetails = ServletUtilities.getPOSTRequestJSONString(request);
        Map<String, String> accountDetailsMap = ServletUtilities.convertJSONStringToMap(accountDetails);
        String newAccountPassword = accountDetailsMap.get("password");
        StandardOutputObject outputObject = new StandardOutputObject();

        //if somehow the user has managed to submit a request for a new account with a password < 6 characters this stops them
        //and issues a message, javascript on the front end should prevent this from ever happening, if the user disables
        //javascript the form shouldnt even submit but better safe than sorry
        if (newAccountPassword.length() < GlobalValues.getMIN_PASSWORD_LENGTH())
        {
            log.debug("password too short, must be >" + GlobalValues.getMIN_PASSWORD_LENGTH() + " characters");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.PASSWORD_TOO_SHORT);
            writeOutput(response, outputObject);
            return;
        }

        String newAccountEmail = accountDetailsMap.get("email");
        String hashedPassword = PasswordEncoder.hashPassword(newAccountPassword);
        boolean success = DatabaseAccess.addUser(newAccountEmail, hashedPassword);
        outputObject.setSuccess(success);
        Map<String, String> tempMap = new HashMap<>();
        tempMap.put("email", newAccountEmail);
        if (success)
        {
            log.debug("new account created for: " + newAccountEmail);
            outputObject.setData(tempMap);
            writeOutput(response, outputObject);

        } else
        {
            log.debug("account already exists for:" + newAccountEmail);
            outputObject.setErrorCode(ErrorCode.ACCOUNT_ALREADY_EXISTS);
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
