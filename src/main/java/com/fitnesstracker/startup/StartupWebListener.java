/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.startup;

import com.fitnesstracker.serverAPI.ServerAPI;
import com.fitnesstracker.database.DatabaseUtils;
import java.util.logging.Level;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class does things on startup, anything that must be done before the
 * application is running should be done here in the contextInitialized()
 * method. This class also takes care of things when the application closes with
 * the contextDestroyed() method.
 *
 * @author max
 */
@WebListener
public class StartupWebListener implements ServletContextListener
{
    private static final Logger log = LoggerFactory.getLogger(StartupWebListener.class);

    @Override
    public void contextInitialized(ServletContextEvent event)
    {
        log.trace("contextInitialized()");
    //do on application init

        //load the database driver
        DatabaseUtils.loadDatabaseDriver();
        ServerAPI.setupServerAPI();

    }

    @Override
    public void contextDestroyed(ServletContextEvent event)
    {
        log.trace("contextDestroyed()");
    //do on application destroy

        //deregister database driver **this may not even be needed**
        DatabaseUtils.dersgisterDatabaseDriver();        
    }

}
