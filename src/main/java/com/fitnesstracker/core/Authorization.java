/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import com.fitnesstracker.database.DatabaseAccess;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
public class Authorization
{

    private static final Logger log = LoggerFactory.getLogger(Authorization.class);

    protected static boolean isCurrentUserAuthorized(String password, String userId)
    {
        log.trace("isCurrentUserAuthorized()");
        boolean output = false;

        Map<String, String> userCredentials = DatabaseAccess.getUserCredentialsFromUserId(userId);
        String storedHashedPassword = userCredentials.get("hashedPassword");
        if (PasswordEncoder.passwordMatch(password, storedHashedPassword))
        {
            output = true;
        }
        log.debug("user authorization:"+String.valueOf(output));
        return output;
    }
}
