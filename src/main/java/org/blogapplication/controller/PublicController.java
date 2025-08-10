package org.blogapplication.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.blogapplication.dto.AuthenticationRequest;
import org.blogapplication.dto.AuthenticationResponse;
import org.blogapplication.dto.OtpRequest;
import org.blogapplication.dto.ResetPasswordRequest;
import org.blogapplication.dto.UserRequest;
import org.blogapplication.dto.UserResponse;
import org.blogapplication.services.AuthenticationService;
import org.blogapplication.services.OtpService;
import org.blogapplication.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Slf4j
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final AuthenticationService authenticationService;
    private final OtpService otpService;
    private final UserService userService;

    @GetMapping("/")
    public String getString() {
        return "OK";
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {
        otpService.generateAndSendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to " + request.getEmail());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        try {
            boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

            if (!isOtpValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
            }

            UserResponse response = authenticationService.registerNewUser(request);
//            otpService.clearOtp(request.getPhoneNumber());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        try {
            AuthenticationResponse authResponse = authenticationService.login(request);

//            Cookie jwtCookie = new Cookie("jwt", authResponse.getToken());
//            jwtCookie.setHttpOnly(true);
//            jwtCookie.setPath("/");
//            jwtCookie.setMaxAge(24 * 60 * 60);
//            jwtCookie.setSameSite("None");
//            response.addCookie(jwtCookie);

            String cookie = ResponseCookie.from("jwt", authResponse.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("None")
                    .build().toString();
            response.setHeader("Set-Cookie", cookie);
            log.info("Log in successful");
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

            if (!isOtpValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
            }

            userService.resetPassword(request.getEmail(), request.getNewPassword());

            otpService.clearOtp(request.getEmail());

            return ResponseEntity.ok("Password reset successfully.");
        } catch (Exception e) {
            log.error("Error resetting password: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong. Please try again.");
        }
    }
}
