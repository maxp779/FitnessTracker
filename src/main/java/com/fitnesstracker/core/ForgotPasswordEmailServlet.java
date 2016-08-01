/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.standardobjects.StandardOutputObject;
import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.email.Email;
import com.fitnesstracker.database.DatabaseAccess;
import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.serverAPI.Request;
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
@WebServlet(name = "ForgotPasswordEmailServlet", urlPatterns =
{
    "/ForgotPasswordEmailServlet"
})
public class ForgotPasswordEmailServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(ForgotPasswordEmailServlet.class);

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
        String loginDetails = ServletUtilities.getPOSTRequestJSONString(request);
        Map<String, String> loginDetailsMap = ServletUtilities.convertJSONStringToMap(loginDetails);
        String email = loginDetailsMap.get("email");

        boolean userExists = DatabaseAccess.userAlreadyExistsCheckEmail(email);
        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setData(loginDetailsMap);
        outputObject.setSuccess(userExists);
        if (!userExists)
        {
            log.debug("user dosent exist");
            outputObject.setErrorCode(ErrorCode.ACCOUNT_DOSENT_EXIST);
            writeOutput(response, outputObject);
            return;
        }

        log.debug("user exists");
        String id_user = DatabaseAccess.getid_user(email);
        UUID identifierToken = DatabaseAccess.createForgotPasswordRecord(id_user, email);

        String subject = "simplfitness.co.uk password change request";
        String content = "Hello, please click the following link to change your password, it is valid for 60 minutes: "
                + createForgotPasswordLink(identifierToken);

        boolean sendEmailSuccess = Email.sendEmail(email, subject, content);
        outputObject.setSuccess(sendEmailSuccess);
        if (!sendEmailSuccess)
        {
            log.debug("sending email failed");
            outputObject.setErrorCode(ErrorCode.SENDING_EMAIL_FAILED);
            writeOutput(response, outputObject);
            return;
        }
        log.debug("sending email successful");
        writeOutput(response, outputObject);

    }

    private String createForgotPasswordLink(UUID identifierToken)
    {
        StringBuilder output = new StringBuilder();
        output.append(GlobalValues.getDOMAIN_NAME());
        output.append("/");
        output.append(FrontControllerServlet.class.getSimpleName());
        output.append("/");
        output.append(Request.CHANGE_PASSWORD_PAGE_REQUEST.toString());
        output.append("?identifierToken=");
        output.append(identifierToken.toString());
        return output.toString();
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
