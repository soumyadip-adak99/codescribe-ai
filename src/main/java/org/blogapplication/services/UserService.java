package org.blogapplication.services;

import org.blogapplication.dto.ChangePasswordRequest;
import org.blogapplication.dto.UserResponse;
import org.blogapplication.dto.UserUpdateRequest;
import org.blogapplication.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.lang.String;
import java.util.List;

public interface UserService {

    void updateUserData(UserUpdateRequest request);

    void updateProfileImage(MultipartFile image);

    void deleteAccount();

    boolean validatePassword(String rawPassword);

    void changePassword(ChangePasswordRequest request);

    void sendPasswordResetEmail(String email);

    void resetPassword(String email, String newPassword);

    void followUser(String followerId, String targetUserId);

    void unfollowUser(String followerId, String targetUserId);

    void saveUser(User user);

    List<UserResponse> getFollowers(String userId);

    List<UserResponse> getFollowing(String userId);
}
