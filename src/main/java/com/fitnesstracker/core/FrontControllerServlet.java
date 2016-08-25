/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.webpageservlets.SettingsPageServlet;
import com.fitnesstracker.webpageservlets.ForgotPasswordPageServlet;
import com.fitnesstracker.webpageservlets.MacroLogPageServlet;
import com.fitnesstracker.webpageservlets.LoginPageServlet;
import com.fitnesstracker.webpageservlets.MyStatsPageServlet;
import com.fitnesstracker.webpageservlets.WorkoutLogPageServlet;
import com.fitnesstracker.webpageservlets.CustomFoodsPageServlet;
import com.fitnesstracker.webpageservlets.CreateAccountPageServlet;
import com.fitnesstracker.webpageservlets.ChangePasswordPageServlet;
import com.fitnesstracker.webpageservlets.FoodLogPageServlet;
import com.fitnesstracker.serverAPI.Request;
import com.fitnesstracker.serverAPI.GetServerAPIServlet;
import com.fitnesstracker.controllerservlets.AddEatenFoodServlet;
import com.fitnesstracker.controllerservlets.GetIdentifierTokenEmailServlet;
import com.fitnesstracker.controllerservlets.DeleteCustomFoodServlet;
import com.fitnesstracker.controllerservlets.GetAllClientDataServlet;
import com.fitnesstracker.controllerservlets.GetUserStatsServlet;
import com.fitnesstracker.controllerservlets.EditCustomFoodServlet;
import com.fitnesstracker.controllerservlets.GetSelectedFoodPropertiesServlet;
import com.fitnesstracker.controllerservlets.RemoveEatenFoodServlet;
import com.fitnesstracker.controllerservlets.GetEatenFoodListServlet;
import com.fitnesstracker.controllerservlets.CreateCustomFoodServlet;
import com.fitnesstracker.controllerservlets.GetCustomFoodListServlet;
import com.fitnesstracker.controllerservlets.GetFriendlyPropertiesServlet;
import com.fitnesstracker.controllerservlets.ModifySelectedPropertiesServlet;
import com.fitnesstracker.controllerservlets.ModifyUserStatsServlet;
import com.fitnesstracker.controllerservlets.SearchForFoodServlet;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This is the servlet that routes all client requests to the appropriate
 * resource, it also attaches a jsessionid to the request object if there is a
 * jsessionid. Certain servlets require additional commands e.g
 * /AuthenticationServlet/mobileLoginPage as those servlets will serve both
 * mobile and desktop clients and take appropriate action
 *
 * @author max
 */
@WebServlet(name = "FrontControllerServlet", urlPatterns =
{
    "/FrontControllerServlet/*"
})
public class FrontControllerServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(FrontControllerServlet.class);
    private static final Map<String, String> requestToServletMapping;
    //private static final Map<Requests, String> ServerAPIReference = ServerAPI.getREQUESTS_API_MAP();

    static
    {
        requestToServletMapping = new HashMap<>();
        requestToServletMapping.put(Request.LOGIN_PAGE_REQUEST.toString(), "/" + LoginPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.LOGOUT_REQUEST.toString(), "/" + LogoutServlet.class.getSimpleName());
        requestToServletMapping.put(Request.LOGIN_REQUEST.toString(), "/" + AuthenticationServlet.class.getSimpleName());
        requestToServletMapping.put(Request.MACRO_LOG_PAGE_REQUEST.toString(), "/" + MacroLogPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CREATE_ACCOUNT_REQUEST.toString(), "/" + CreateAccountServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CREATE_ACCOUNT_PAGE_REQUEST.toString(), "/" + CreateAccountPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.WORKOUT_LOG_PAGE_REQUEST.toString(), "/" + WorkoutLogPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CUSTOM_FOODS_PAGE_REQUEST.toString(), "/" + CustomFoodsPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.MY_STATS_PAGE_REQUEST.toString(), "/" + MyStatsPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_CUSTOM_FOOD_LIST.toString(), "/" + GetCustomFoodListServlet.class.getSimpleName());
        requestToServletMapping.put(Request.DELETE_CUSTOM_FOOD.toString(), "/" + DeleteCustomFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CREATE_CUSTOM_FOOD.toString(), "/" + CreateCustomFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.EDIT_CUSTOM_FOOD.toString(), "/" + EditCustomFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.ADD_EATEN_FOOD.toString(), "/" + AddEatenFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_EATEN_FOOD_LIST.toString(), "/" + GetEatenFoodListServlet.class.getSimpleName());
        requestToServletMapping.put(Request.REMOVE_EATEN_FOOD.toString(), "/" + RemoveEatenFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.SEARCH_FOR_FOOD.toString(), "/" + SearchForFoodServlet.class.getSimpleName());
        requestToServletMapping.put(Request.MODIFY_SELECTED_FOOD_PROPERTIES.toString(), "/" + ModifySelectedPropertiesServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_SELECTED_FOOD_PROPERTIES.toString(), "/" + GetSelectedFoodPropertiesServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_FRIENDLY_NAMES.toString(), "/" + GetFriendlyPropertiesServlet.class.getSimpleName());
        requestToServletMapping.put(Request.MODIFY_USER_STATS.toString(), "/" + ModifyUserStatsServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_USER_STATS.toString(), "/" + GetUserStatsServlet.class.getSimpleName());
        requestToServletMapping.put(Request.FORGOT_PASSWORD_PAGE_REQUEST.toString(), "/" + ForgotPasswordPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.FORGOT_PASSWORD_EMAIL_REQUEST.toString(), "/" + ForgotPasswordEmailServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CHANGE_PASSWORD_PAGE_REQUEST.toString(), "/" + ChangePasswordPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CHANGE_PASSWORD_REQUEST.toString(), "/" + ChangePasswordServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_IDENTIFIER_TOKEN_EMAIL.toString(), "/" + GetIdentifierTokenEmailServlet.class.getSimpleName());
        requestToServletMapping.put(Request.SETTINGS_PAGE_REQUEST.toString(), "/" + SettingsPageServlet.class.getSimpleName());
        requestToServletMapping.put(Request.CHANGE_EMAIL_REQUEST.toString(), "/" + ChangeEmailServlet.class.getSimpleName());
        requestToServletMapping.put(Request.DELETE_ACCOUNT_REQUEST.toString(), "/" + DeleteAccountServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_SERVER_API.toString(), "/" + GetServerAPIServlet.class.getSimpleName());
        requestToServletMapping.put(Request.GET_ALL_CLIENT_DATA.toString(), "/" + GetAllClientDataServlet.class.getSimpleName());
        requestToServletMapping.put(Request.FOOD_LOG_PAGE_REQUEST.toString(), "/" + FoodLogPageServlet.class.getSimpleName());

    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        log.trace("processRequest()");
        log.info(request.getRequestURI());
        log.info("querystring:" + request.getQueryString());
        String currentRequest = request.getRequestURI();
        currentRequest = currentRequest.replaceAll("/" + FrontControllerServlet.class.getSimpleName() + "/", "");
        log.info(currentRequest);

        if (requestToServletMapping.containsKey(currentRequest))
        {
            String servletName = requestToServletMapping.get(currentRequest);
            forwardRequest(request, response, servletName);
        } else
        {
            log.error("invalid request");
            forwardRequest(request, response, "/ErrorPageServlet");
        }

    }

    private void forwardRequest(HttpServletRequest request, HttpServletResponse response, String servletName) throws ServletException, IOException
    {
        log.trace("forwardRequest()");
        log.info(servletName);
        RequestDispatcher rd = request.getRequestDispatcher(servletName);
        rd.forward(request, response);
    }

    /**
     * This method returns the end part of an HttpServletRequest object e.g an
     * HttpServletRequest of /SomeServlet/Stuff/mobile.html would return
     * "mobile.html"
     *
     * @param request
     * @return A String representing the request made
     */
//    public static String getRequest(HttpServletRequest request)
//    {
//        log.trace("getRequest");
//
//        //get and format the request from the URL given
//        String output = "";
//        String currentRequestURL = request.getRequestURI();
//        StringBuilder currentRequestStringBuilder = new StringBuilder(currentRequestURL);
//
//        //get the command
//        int slashIndex = currentRequestStringBuilder.lastIndexOf("/");
//        currentRequestStringBuilder = currentRequestStringBuilder.delete(0, slashIndex + 1);
//
//        //if jsessionid is part of the URI remove it
//        //strangely enough this seems to be needed with tomee and not glassfish
//        int jsessionidIndex = currentRequestStringBuilder.indexOf(";jsessionid=");
//        if (jsessionidIndex != -1)
//        {
//            currentRequestStringBuilder = currentRequestStringBuilder.delete(jsessionidIndex, currentRequestStringBuilder.length());
//
//        }
//
//        return currentRequestStringBuilder.toString();
//    }
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
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
        processRequest(request, response);
    }

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
        processRequest(request, response);
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
