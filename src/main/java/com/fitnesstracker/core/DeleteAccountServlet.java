/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.database.DatabaseAccess;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
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
@WebServlet(name = "DeleteAccountServlet", urlPatterns =
{
    "/DeleteAccountServlet"
})
public class DeleteAccountServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(DeleteAccountServlet.class);
    private static final String DELETE_ACCOUNT_SUCCESS = "<div class=\"alert alert-success\" role=\"alert\">The account for #EMAIL has been deleted successfully.</div>";
    private static final String DELETE_ACCOUNT_FAIL = "<div class=\"alert alert-danger\" role=\"alert\">An error occurred, please try again.</div>";
    private static final String INCORRECT_PASSWORD = "<div class=\"alert alert-danger\" role=\"alert\">Incorrect password.</div>";

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
        HttpSession session = request.getSession();
        UserObject currentUser = ServletUtilities.getCurrentUser(request);
        String id_user = currentUser.getId_user();
        String password = request.getParameter("deleteAccountPassword");
        boolean authorized = Authorization.isCurrentUserAuthorized(password, id_user);

        //THIS IF CONDITION CAN BE DELETED WHEN OUT OF TESTING! It is only to prevent test account deletion
        if ("30".equals(id_user))
        {
            ServletContext servletContext = this.getServletContext();
            PrintWriter out = response.getWriter();
            out.println("<div class=\"alert alert-danger\" role=\"alert\">Sorry, cant let you delete the test account ;)</div>");
            RequestDispatcher requestDispatcher = servletContext.getRequestDispatcher(GlobalValues.getSETTINGS_PAGE_URL());
            requestDispatcher.include(request, response);
            return;
        }

        boolean success;
        if (authorized)
        {
            success = DatabaseAccess.deleteAccount(id_user);
        } else
        {
            writeOutput(request, response, INCORRECT_PASSWORD, false);
            return;
        }

        if (success)
        {
            String email = (String) session.getAttribute("email");
            writeOutput(request, response, DELETE_ACCOUNT_SUCCESS.replaceAll("#EMAIL", email), true);
        } else
        {
            writeOutput(request, response, DELETE_ACCOUNT_FAIL, false);
        }
    }

    private void writeOutput(HttpServletRequest request, HttpServletResponse response, String output, boolean accountDeleted) throws IOException, ServletException
    {
        log.trace("writeOutput()");
        ServletContext servletContext = this.getServletContext();
        RequestDispatcher requestDispatcher;

        if (accountDeleted)
        {
            log.debug("account deleted");
            requestDispatcher = servletContext.getRequestDispatcher(GlobalValues.getLOGIN_PAGE_URL());
            SessionManager.httpSessionRemove(request.getSession());
        } else
        {
            log.debug("account not deleted");
            requestDispatcher = servletContext.getRequestDispatcher(GlobalValues.getSETTINGS_PAGE_URL());
        }

        PrintWriter out = response.getWriter();
        out.println(output);
        requestDispatcher.include(request, response);
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
