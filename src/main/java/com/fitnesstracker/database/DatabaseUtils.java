/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.database;

import com.fitnesstracker.core.StandardOutputObject;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class contains various database related methods, most of which are self
 * explanatory.
 *
 * @author max
 */
public class DatabaseUtils
{

    private static final Logger log = LoggerFactory.getLogger(DatabaseUtils.class);

    /**
     * This method returns a database connection, the connection MUST be closed
     * by whatever class calls this method otherwise connections will leak and
     * eventually there wont be any left.
     *
     * <p>
     * In addition all ResultSet and Statement objects derived from the
     * Connection must also be closed. This can be done manually or via
     * DatabaseUtils.closeConnections()</p>
     *
     * <p>
     * If done manually the objects should be closed in the following order:
     * ResultSet --> Statement --> Connection</p>
     *
     * @return a Connection object to connect with the database
     */
    protected static Connection getDatabaseConnection()
    {
        log.trace("getDatabaseConnection()");
        InitialContext initialContext = null;
        try
        {
            initialContext = new InitialContext();
        } catch (NamingException ex)
        {
            log.error("get InitialContext failed", ex);
        }

        DataSource source = null;

        try
        {
            //source = (DataSource) initialContext.lookup("java:/comp/env/jdbc/mydb");
            source = (DataSource) initialContext.lookup("java:/comp/env/jdbc/fitnesstrackerdatabaseJNDI");
        } catch (NamingException ex)
        {
            log.error("get DataSource failed", ex);
        }

        Connection aConnection = null;

        try
        {
            aConnection = source.getConnection();
        } catch (SQLException ex)
        {
            log.error("get Connection failed", ex);
        }

        return aConnection;
    }

    public static void loadDatabaseDriver()
    {
        log.trace("loadDatabaseDriver()");
        try
        {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException ex)
        {
            log.error("load database driver failed", ex);
        }
    }

    public static void dersgisterDatabaseDriver()
    {
        log.trace("dersgisterDatabaseDriver()");
        ClassLoader aClassLoader = Thread.currentThread().getContextClassLoader();
        Enumeration<Driver> driverEnumeration = DriverManager.getDrivers();

        while (driverEnumeration.hasMoreElements())
        {
            Driver currentDriver = driverEnumeration.nextElement();

            //if currentDriver was registered by this application deregister it
            if (currentDriver.getClass().getClassLoader().equals(aClassLoader))
            {
                try
                {
                    DriverManager.deregisterDriver(currentDriver);
                } catch (SQLException ex)
                {
                    log.error("deregistering database driver failed", ex);
                }
            } else
            {
                //currentDriver is not linked with this application
                //do not deregister it
            }
        }
    }
}
