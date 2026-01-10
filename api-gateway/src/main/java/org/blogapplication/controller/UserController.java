package org.blogapplication.controller;


import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.dto.UserResponse;
import org.blogapplication.dto.UserUpdateRequest;
import org.blogapplication.services.AuthenticationService;
import org.blogapplication.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    /**
     * this end point return logged user details this end point need optimize and this end point make for testing
     * after few days this end point might be optimized
     */
    @GetMapping
    public ResponseEntity<UserResponse> getLoggedUserDetails() {
        try {
            return ResponseEntity.ok(authenticationService.getLoggedUser());
        } catch (Exception e) {
            log.error("Error getting user details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping(value = "/upload-profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadProfileImage(@RequestPart("file") MultipartFile file) {
        try {
            userService.updateProfileImage(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/update/details")
    public ResponseEntity<Void> updateUserDetails(@RequestBody UserUpdateRequest request) {
        try {
            userService.updateUserData(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Void> deleteUserAccount() {
        try {
            userService.deleteAccount();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/log-out")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        String clearCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(0))
                .sameSite("None")
                .build().toString();

        response.setHeader("Set-Cookie", clearCookie);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}