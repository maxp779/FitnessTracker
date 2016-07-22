/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.webpageservlets;

import com.fitnesstracker.globalvalues.GlobalValues;
import java.io.IOException;
import javax.servlet.ServletContext;
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
@WebServlet(name = "ChangePasswordPageServlet", urlPatterns =
{
    "/ChangePasswordPageServlet"
})
public class ChangePasswordPageServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(ChangePasswordPageServlet.class);

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
        ServletContext servletContext = this.getServletContext();

        String identifierToken = request.getQueryString();
        identifierToken = identifierToken.substring(identifierToken.indexOf("=") + 1);

        response.sendRedirect(servletContext.getContextPath() + GlobalValues.getCHANGE_PASSWORD_PAGE_URL() + "?identifierToken=" + identifierToken);
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
