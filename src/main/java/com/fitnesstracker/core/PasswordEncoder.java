/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 *
 * @author max
 */
public class PasswordEncoder
{

    private static final Logger log = LoggerFactory.getLogger(PasswordEncoder.class);
    private static final int PASSWORD_STRENGTH = 10; //default is 10 anyway but this can be changed

    protected static String hashPassword(String aPassword)
    {
        log.trace("hashPassword");
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(PASSWORD_STRENGTH);
        return passwordEncoder.encode(aPassword);
    }

    protected static boolean passwordMatch(String inputPassword, String storedHashedPassword)
    {
        log.trace("passwordMatch");
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(PASSWORD_STRENGTH);
        return passwordEncoder.matches(inputPassword, storedHashedPassword);
    }

}
