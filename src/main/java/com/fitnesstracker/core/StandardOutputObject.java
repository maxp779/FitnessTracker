/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.google.gson.Gson;
import com.fitnesstracker.serverAPI.ErrorCode;
import com.fitnesstracker.serverAPI.ServerAPI;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Standard object to contain data to be sent to the client, can be converted to
 * a JSON string easily.
 *
 * @author max
 */
public class StandardOutputObject
{

    private static final Logger log = LoggerFactory.getLogger(StandardOutputObject.class);
    private boolean success = false;
    private Integer errorCode;
    private Object data;

    /**
     * Uses googles gson library to turn this object into a JSON string to be
     * sent to the client. The JSON has the format: 
     * { 
     * "success":true,
     * "errorCode":{"10":"Some error description"},
     * "data":{"someDataIdentifier":someData}
     * }
     * 
     * *IMPORTANT* 
     * gson will convert a List of Maps into an array of objects [{},{},{}]
     * gson will convert a single Map into an object {}
     * Use the appropriate storage method for data, a List of Maps which only have
     * a single key value pair each is better represented as a single Map!
     * 
     * The idea is to standardize the responses the client recieves from the
     * server. Every response will be a JSON of some form.
     *
     * @return A JSON String representation of this object
     */
    public String getJSONString()
    {
        log.trace("getJSONString()");
        Gson gson = new Gson();
        Map<String, Object> tempMap = new HashMap();
        tempMap.put("success", success);
        tempMap.put("errorCode", errorCode);
        tempMap.put("data", data);

        String JSONString = gson.toJson(tempMap);
        log.debug(JSONString);
        return JSONString;
    }

    /**
     * Lets the client know if the request was successful or not. For example
     * valid JSON may have been returned by the server but if success=false then
     * a database query may have failed for some reason.
     *
     * @param aBoolean was the request successful or not
     */
    public void setSuccess(boolean aBoolean)
    {
        success = aBoolean;
    }

    /**
     * Takes an ErrorCode Enum argument and sets the errorCode parameter of this
     * object to the appropriate numeric code e.g ErrorCode.PASSWORD_TOO_SHORT
     * may be set to 10 ErrorCode.LOGIN_FAILED may be 11 etc
     *
     * @param code
     */
    public void setErrorCode(ErrorCode code)
    {
        errorCode = ServerAPI.getErrorCodeFromEnum(code);
    }

    /**
     * Takes a Map to be sent to the client, this Map will be converted into a
     * JSON string
     *
     * @param input a Map
     */
    public void setData(Object input)
    {
        data = input;
    }

    @Override
    public String toString()
    {
        return this.getJSONString();
    }
}
