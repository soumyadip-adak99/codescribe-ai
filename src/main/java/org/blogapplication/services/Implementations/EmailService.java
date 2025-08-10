package org.blogapplication.services.Implementations;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor

public class EmailService {

    public final JavaMailSender mailSender;

    @Async
    public void sendSuccessfulEmail(String userEmail, String username, String path) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(userEmail);
            helper.setSubject("Registration Successful");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream(path))) {
                String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                htmlContent = htmlContent.replace("{{user}}", username);
                helper.setText(htmlContent, true);
            }

            mailSender.send(message);
            log.info("Email sent successfully to: {}", userEmail);
        } catch (Exception e) {
            log.error("Error sending mail to {}: {}", userEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }


    @Async
    public void sendPasswordResetEmail(String email, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Password Reset Successful");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream("/templates/passwordResetEmail.html"))) {
                String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                htmlContent = htmlContent.replace("{{user}}", username);
                helper.setText(htmlContent, true);
            }
            mailSender.send(message);
            log.info("Successfully sent password reset email to: {}", email);
        } catch (Exception e) {
            log.error("Error sending mail to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendOtpEmail(String userEmail, String otp, String path) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(userEmail);
            helper.setSubject("One Time OTP Password");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream(path))) {
                String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                htmlContent = htmlContent.replace("{{otp}}", otp);
                helper.setText(htmlContent, true);
            }

            mailSender.send(message);
            log.info("Email sent successfully to: {}", userEmail);
        } catch (Exception e) {
            log.error("Error sending mail to {}: {}", userEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendDeleteAccountEmail(String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Delete Account Successful");

            try (var inputStream = Objects.requireNonNull(EmailService.class.getResourceAsStream("/templates/deleteEmail.html"))) {
                String htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                htmlContent = htmlContent.replace("{{userEmail}}", email);
                htmlContent = htmlContent.replace("{{deletionDate}}", LocalDate.now().toString());
                helper.setText(htmlContent, true);
            }
            mailSender.send(message);
            log.info("Email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Error sending mail to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }
}

