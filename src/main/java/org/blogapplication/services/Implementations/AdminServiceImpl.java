package org.blogapplication.services.Implementations;

import lombok.RequiredArgsConstructor;

import org.blogapplication.constants.BlogStatus;
import org.blogapplication.constants.Roles;
import org.blogapplication.constants.UserStatus;
import org.blogapplication.dto.BlogResponse;
import org.blogapplication.dto.BlogStatsResponse;
import org.blogapplication.dto.PlatformStatsResponse;
import org.blogapplication.dto.UserActivityResponse;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.User;
import org.blogapplication.repository.BlogRepository;
import org.blogapplication.repository.UserRepository;
import org.blogapplication.services.AdminService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    // private final EmailService emailService;

    @Override
    public List<BlogResponse> getUserBlogs(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        return user.getBlogEntries().stream().map(this::mapToBlogResponse).collect(Collectors.toList());
    }

    private BlogResponse mapToBlogResponse(BlogEntries blogEntry) {
        return BlogResponse.builder()
                .id(blogEntry.getId())
                .title(blogEntry.getTitle())
                .content(blogEntry.getContent())
                .createdDate(blogEntry.getCreatedDate())
                .build();
    }

    @Override
    public void promoteToAdmin(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        user.setRole(List.of(Roles.ROLE_ADMIN.toString()));
    }

    @Override
    public void suspendUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        user.setUserStatus(UserStatus.SUSPENDED);
        userRepository.save(user);
    }

    @Override
    public boolean isUserActive(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));

        return user.getUserStatus().equals(UserStatus.ACTIVE);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<BlogEntries> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public String getUserStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        return user.getUserStatus().toString();
    }

    @Override
    public void deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        user.setUserStatus(UserStatus.BLOCKED);
        userRepository.save(user);

    }

    @Override
    public void reactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        user.setUserStatus(UserStatus.ACTIVE);
        userRepository.save(user);

    }

    @Override
    public void softDeleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        user.setUserStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    @Override
    public void hardDeleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found With this ID"));
        userRepository.deleteById(user.getId());
    }

    @Override
    public void updateUserRoles(String userId, List<String> roles) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("No User With This ID"));

        user.setRole(roles);
        userRepository.save(user);
    }

    @Override
    public List<User> getUsersByStatus(UserStatus status) {
        return userRepository.findByUserStatus(status);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(List.of(role));
    }

    @Override
    public void rejectBlog(String blogId, String reason) {
        BlogEntries blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Not Found"));
        blog.setStatus(BlogStatus.REJECTED);
        // Please Send a Email to the user with the reason why his Blog is rejected
        // for more info contact the Admin give admin mail..
    }

    @Override
    public void deleteBlog(String blogId) {
        blogRepository.deleteById(blogId);
    }

    @Override
    public BlogStatsResponse getBlogStats() {
        List<BlogEntries> allBlogs = blogRepository.findAll();
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();

        long totalBlogs = allBlogs.size();
        long approvedBlogs = allBlogs.stream()
                .filter(blog -> blog.getStatus() == BlogStatus.APPROVED)
                .count();

        long rejectedBlogs = allBlogs.stream()
                .filter(blog -> blog.getStatus() == BlogStatus.REJECTED)
                .count();

        long aiApprovedBlogs = allBlogs.stream()
                .filter(BlogEntries::isAiApproved)
                .count();

        long blogsToday = allBlogs.stream()
                .filter(blog -> blog.getCreatedDate() != null &&
                        blog.getCreatedDate().toLocalDate().equals(today))
                .count();

        long blogsThisMonth = allBlogs.stream()
                .filter(blog -> blog.getCreatedDate() != null &&
                        YearMonth.from(blog.getCreatedDate()).equals(currentMonth))
                .count();

        return BlogStatsResponse.builder()
                .totalBlogs(totalBlogs)
                .approvedBlogs(approvedBlogs)
                .rejectedBlogs(rejectedBlogs)
                .aiApprovedBlogs(aiApprovedBlogs)
                .blogsToday(blogsToday)
                .blogsThisMonth(blogsThisMonth)
                .build();
    }

    @Override
    public PlatformStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByUserStatus(UserStatus.ACTIVE);

        List<BlogEntries> blogs = blogRepository.findAll();
        long totalBlogs = blogs.size();
        long approvedBlogs = blogs.stream()
                .filter(b -> b.getStatus() == BlogStatus.APPROVED).count();
        long aiApprovedBlogs = blogs.stream()
                .filter(BlogEntries::isAiApproved).count();
        long blogsToday = blogs.stream()
                .filter(b -> b.getCreatedDate() != null &&
                        b.getCreatedDate().toLocalDate().equals(LocalDate.now()))
                .count();

        return PlatformStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalBlogs(totalBlogs)
                .approvedBlogs(approvedBlogs)
                .aiApprovedBlogs(aiApprovedBlogs)
                .blogsToday(blogsToday)
                .build();
    }

    @Override
    public List<UserActivityResponse> getTopContributors() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> UserActivityResponse.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .blogCount(user.getBlogEntries().size())
                        .build())
                .sorted(Comparator.comparingLong(UserActivityResponse::getBlogCount).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

}
