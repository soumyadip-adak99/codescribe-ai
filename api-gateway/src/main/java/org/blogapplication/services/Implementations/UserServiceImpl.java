package org.blogapplication.services.Implementations;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.dto.ChangePasswordRequest;
import org.blogapplication.dto.UserResponse;
import org.blogapplication.dto.UserUpdateRequest;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.ImageEntity;
import org.blogapplication.entity.User;
import org.blogapplication.repository.BlogRepository;
import org.blogapplication.repository.UserRepository;
import org.blogapplication.services.ImageService;
import org.blogapplication.services.UserService;
import org.blogapplication.util.UserUtilityService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserUtilityService userUtilityService;
    private final ImageService imageService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final BlogRepository blogRepository;

    @Override
    public void updateUserData(UserUpdateRequest request) {
        User existingUser = loggedUser();

        existingUser.setFirstname(
                request.getFirstname() != null ? request.getFirstname() : existingUser.getFirstname());
        existingUser.setLastname(
                request.getLastname() != null ? request.getLastname() : existingUser.getLastname());
        existingUser.setEmail(
                request.getEmail() != null ? request.getEmail() : existingUser.getEmail());
//        existingUser.setPhoneNumber(
//                request.getPhoneNumber() != null ? request.getPhoneNumber() : existingUser.getPhoneNumber());

        userRepository.save(existingUser);
    }

    @Override
    public void updateProfileImage(MultipartFile image) {
        User existUser = loggedUser();

        try {
            ImageEntity uploadImage;
            if (existUser.getProfileImage() != null && existUser.getProfileImage().get("id") != null) {
                uploadImage = imageService.replaceImage(existUser.getProfileImage().get("id"), image);
            } else {
                uploadImage = imageService.uploadImage(image);
            }

            Map<String, String> profileImageMap = new HashMap<>();
            profileImageMap.put("id", uploadImage.getId());
            profileImageMap.put("url", uploadImage.getImageUrl());

            existUser.setProfileImage(profileImageMap);

            // Update user's blog entries with new image
            String email = userUtilityService.getLoggedUserName();
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            user.getBlogEntries().forEach(blog -> {
                blog.setAuthorProfileImage(profileImageMap);
                blogRepository.save(blog);
            });

            userRepository.save(existUser);
        } catch (IOException e) {
            log.error("Error while updating profile image: ", e);
            throw new UsernameNotFoundException("Failed to update profile image");
        }
    }

    @Override
    public void deleteAccount() {
        String email = userUtilityService.getLoggedUserName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<BlogEntries> blogEntries = user.getBlogEntries();

        if (blogEntries != null) {
            blogRepository.deleteAll(blogEntries);
        }
        emailService.sendDeleteAccountEmail(email);
        userRepository.delete(loggedUser());
    }

    @Override
    public boolean validatePassword(String rawPassword) {
        return passwordEncoder.matches(rawPassword, loggedUser().getPassword());
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = loggedUser();
        if (validatePassword(request.getOldPassword())) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            sendPasswordResetEmail(user.getEmail());
        } else {
            throw new UsernameNotFoundException("Old Password Not Valid");
        }
    }

    @Override
    public void sendPasswordResetEmail(String email) {
        User user = loggedUser();
        String username = user.getFirstname() + " " + user.getLastname();
        emailService.sendPasswordResetEmail(email, username);
    }

    @Override
    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void followUser(String followerId, String targetUserId) {
    }

    @Override
    public void unfollowUser(String followerId, String targetUserId) {
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Override
    public List<UserResponse> getFollowers(String userId) {
        return List.of();
    }

    @Override
    public List<UserResponse> getFollowing(String userId) {
        return List.of();
    }

    private User loggedUser() {
        return userRepository.findByEmail(userUtilityService.getLoggedUserName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
