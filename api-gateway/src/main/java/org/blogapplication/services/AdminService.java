package org.blogapplication.services;

import org.blogapplication.constants.UserStatus;
import org.blogapplication.dto.BlogResponse;
import org.blogapplication.dto.BlogStatsResponse;
import org.blogapplication.dto.PlatformStatsResponse;
import org.blogapplication.dto.UserActivityResponse;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.User;

import java.util.List;

public interface AdminService {

    // USER MANAGEMENT
    void deactivateUser(String userId);

    void reactivateUser(String userId);

    void softDeleteUser(String userId);

    void hardDeleteUser(String userId);

    void updateUserRoles(String userId, List<String> roles);

    List<User> getUsersByStatus(UserStatus status);

    List<User> getUsersByRole(String role);

    boolean isUserActive(String userId);

    String getUserStats(String userId);

    void promoteToAdmin(String userId);

    void suspendUser(String userId);

    List<User> getAllUsers();
    List<BlogEntries>getAllBlogs();

    // BLOG MODERATION
    void rejectBlog(String blogId, String reason);

    void deleteBlog(String blogId);

    List<BlogResponse> getUserBlogs(String userId);

    // SYSTEM ANALYTICS
    BlogStatsResponse getBlogStats(); // Example: { totalBlogs: 123, published: 100, pending: 23 }

    PlatformStatsResponse getPlatformStats();

    List<UserActivityResponse> getTopContributors();

}
