/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fitnesstracker.email;

import com.fitnesstracker.core.FrontControllerServlet;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author max
 */
public class Email
{

    private static final Logger log = LoggerFactory.getLogger(Email.class);

    public static boolean sendEmail(String emailAddress, String subject, String emailContent)
    {
        log.trace("sendEmail()");
        boolean output = false;

        // Sender's email ID needs to be mentioned
        String from = "simplfitness779@gmail.com";//change accordingly
        final String username = "simplfitness779@gmail.com";//change accordingly
        final String password = "sunny779";//change accordingly

        // Assuming you are sending email through relay.jangosmtp.net
        String host = "smtp.gmail.com";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", "587");

        // Get the Session object.
        Session session = Session.getInstance(props,
                new javax.mail.Authenticator()
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication(username, password);
            }
        });

        try
        {
            // Create a default MimeMessage object.
            Message message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(from));

            // Set To: header field of the header.
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(emailAddress));

            // Set Subject: header field
            message.setSubject(subject);

            // Now set the actual message
            message.setText(emailContent);

            // Send message
            Transport.send(message);
            output = true;
        } catch (MessagingException e)
        {
            output = false;
            throw new RuntimeException(e);
        }
        log.info(String.valueOf(output));
        return output;
    }
}
