/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.database.DatabaseAccess;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
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
 *
 * @author max
 */
@WebServlet(name = "ChangeEmailServlet", urlPatterns =
{
    "/ChangeEmailServlet"
})
public class ChangeEmailServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(ChangeEmailServlet.class);

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
        HttpSession session = request.getSession();
        UserObject currentUser = ServletUtils.getCurrentUser(request);
        String requestDetails = ServletUtils.getPOSTRequestJSONString(request);
        Map<String, String> requestDetailsMap = ServletUtils.convertJSONStringToMap(requestDetails);
        String password = requestDetailsMap.get("changeEmailPassword");

        StandardOutputObject outputObject = new StandardOutputObject();
        if (!Authorization.isCurrentUserAuthorized(password, currentUser.getUserId()))
        {
            log.debug("user not authorized");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.AUTHORIZATION_FAILED);
            writeOutput(response, outputObject);
            return;
        }

        String newEmail = requestDetailsMap.get("newEmail");
        if (DatabaseAccess.userAlreadyExistsCheckEmail(newEmail))
        {
            log.debug("new email already exists");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.ACCOUNT_ALREADY_EXISTS);
            writeOutput(response, outputObject);
            return;
        }

        if (DatabaseAccess.changeEmail(newEmail, currentUser.getUserId()))
        {
            log.debug("email changed successfully");
            outputObject.setSuccess(true);
            Map<String, String> tempMap = new HashMap<>();
            tempMap.put("newEmail", newEmail);
            UserObject user = (UserObject) session.getAttribute("user");
            tempMap.put("oldEmail", user.getEmail());
            user.setEmail(newEmail);
            outputObject.setData(tempMap);
            writeOutput(response, outputObject);

        } else
        {
            log.debug("email change failed");
            outputObject.setSuccess(false);
            outputObject.setErrorCode(ErrorCode.CHANGE_EMAIL_FAILED);
            writeOutput(response, outputObject);
        }
    }

    private void writeOutput(HttpServletResponse response, StandardOutputObject outputMap)
    {
        log.trace("writeOutput()");
        String outputJSON = outputMap.getJSONString();
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
