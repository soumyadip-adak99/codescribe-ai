package org.blogapplication.services.Implementations;

import lombok.RequiredArgsConstructor;
import org.blogapplication.dto.ApiResponseBlogs;
import org.blogapplication.dto.ApiResponseUser;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.User;
import org.blogapplication.repository.BlogRepository;
import org.blogapplication.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public List<ApiResponseUser> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ApiResponseUser getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToResponse(user);
    }

    public List<ApiResponseBlogs> getAllBlogs() {
        List<BlogEntries> blogs = blogRepository.findAll();
        return blogs.stream().map(this::convertToBlogResponse).collect(Collectors.toList());
    }

    public ApiResponseUser convertToResponse(User users) {
        return ApiResponseUser.builder()
                .id(users.getId())
                .firstName(users.getFirstname())
                .lastName(users.getLastname())
                .email(users.getEmail())
                .blogEntries(users.getBlogEntries())
                .profileImage(users.getProfileImage())
                .createdAt(users.getCreatedAt())
                .build();

    }

    public ApiResponseBlogs convertToBlogResponse(BlogEntries blogs) {
        return ApiResponseBlogs.builder()
                .id(blogs.getId())
                .title(blogs.getTitle())
                .authorName(blogs.getAuthorName())
                .content(blogs.getContent())
                .image(blogs.getImage())
                .authorProfileImage(blogs.getAuthorProfileImage())
                .createdDate(blogs.getCreatedDate())
                .isAiApproved(blogs.isAiApproved())
                .status(blogs.getStatus())
                .build();
    }
}
