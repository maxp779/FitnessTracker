/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.serverAPI;

import com.fitnesstracker.globalvalues.GlobalValues;
import com.fitnesstracker.standardobjects.StandardFoodObject;
import com.fitnesstracker.standardobjects.StandardOutputObject;
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
@WebServlet(name = "GetServerAPIServlet", urlPatterns =
{
    "/GetServerAPIServlet"
})
public class GetServerAPIServlet extends HttpServlet
{

    private static final Logger log = LoggerFactory.getLogger(GetServerAPIServlet.class);

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

        Map<String, Object> serverAPIMap = new HashMap<>();
        serverAPIMap.put("requests", ServerAPI.getREQUESTS_API_MAP_STRING());
        serverAPIMap.put("errorCodes", ServerAPI.getERROR_CODES_MAP_STRING());
        serverAPIMap.put("standardFoodObject", StandardFoodObject.getEmptyObject());
        serverAPIMap.put("standardOutputObject", StandardOutputObject.getEmptyObject());
        serverAPIMap.put("nonOpertableProperties", GlobalValues.getNON_MATHEMATICALLY_OPERABLE_PROPERTIES());
        serverAPIMap.put("wholeIntegerProperties", GlobalValues.getWHOLE_INTEGER_PROPERTIES());

        StandardOutputObject outputObject = new StandardOutputObject();
        outputObject.setSuccess(true);
        outputObject.setData(serverAPIMap);
        writeOutput(response, outputObject);
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
