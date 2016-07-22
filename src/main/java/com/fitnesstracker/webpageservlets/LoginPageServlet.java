/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.webpageservlets;

import com.fitnesstracker.globalvalues.GlobalValues;
import java.io.IOException;
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
 * This servlet determines whether to send the client to the mobile login page
 * or the desktop login page, if they are already logged in it will send the
 * client to the appropriate main page
 *
 * @author max
 */
@WebServlet(name = "LoginPageServlet", urlPatterns =
{
    "/LoginPageServlet/*"
//,"/index.html"
//comment out the above line if ditching web.xml welcome file configuration,
//without web.xml, index.html is the default initial resource called and this 
//servlet is the one that should respond to such a request
})
public class LoginPageServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(LoginPageServlet.class);

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
        HttpSession session = request.getSession(false);
        ServletContext sc = this.getServletContext();
        String webPageURL = sc.getContextPath() + GlobalValues.getLOGIN_PAGE_URL();

        //if no session exists i.e. user has to login and is referred to a login page
        if (session == null)
        {
            log.info("no session detetced, directing to login page");
            response.sendRedirect(webPageURL);
        } else //if session is valid user is already logged in, puts them back at the main page
        {
            log.info("valid session, redirecting to main page");

            RequestDispatcher rd;
            rd = request.getRequestDispatcher("/MainPageServlet");
            rd.forward(request, response);
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
