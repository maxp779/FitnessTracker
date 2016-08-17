/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
public class UserObject
{
    private static final Logger log = LoggerFactory.getLogger(UserObject.class);
    private String email;
    private String userId;

    public String getEmail()
    {
        return email;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    @Override
    public String toString()
    {
        return "UserObject{" + "email=" + email + ", userId=" + userId + '}';
    }
        
    public Map toMap()
    {
        Map tempMap = new HashMap<>();
        tempMap.put("email", email);
        tempMap.put("userId", userId);
        return tempMap;
    }
    
}
