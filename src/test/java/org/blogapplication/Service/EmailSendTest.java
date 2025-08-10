package org.blogapplication.Service;


import org.blogapplication.services.Implementations.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class EmailSendTest {

    @Autowired
    EmailService emailService;

    @Test
    void testEmail() {
        emailService.sendSuccessfulEmail("work.soumyadipadak@gmail.com", "Soumyadip Adak","templates\successfulEmailMessage.html");
    }
}
