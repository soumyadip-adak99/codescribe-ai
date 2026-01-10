package org.blogapplication.services.Implementations;

import lombok.RequiredArgsConstructor;
import org.blogapplication.constants.BlogStatus;
import org.blogapplication.dto.ApiResponseBlogs;
import org.blogapplication.dto.BlogEditRequest;
import org.blogapplication.dto.BlogRequest;
import org.blogapplication.dto.BlogResponse;
import org.blogapplication.entity.BlogEntries;
import org.blogapplication.entity.ImageEntity;
import org.blogapplication.entity.User;
import org.blogapplication.model.ContentCheckResponse;
import org.blogapplication.model.PromptRequest;
import org.blogapplication.repository.BlogRepository;
import org.blogapplication.repository.ImageRepository;
import org.blogapplication.repository.UserRepository;
import org.blogapplication.services.BlogService;
import org.blogapplication.services.ImageService;
import org.blogapplication.util.UserUtilityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final ContentCheckerService contentCheckerService;
    private final UserUtilityService userUtilityService;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;

    @Transactional
    @Override
    public BlogResponse createBlog(BlogRequest blogRequest, MultipartFile file) {
        PromptRequest promptRequest = new PromptRequest(blogRequest.getTitle() + " " + blogRequest.getContent());
        ContentCheckResponse response = contentCheckerService.sendPrompt(promptRequest);

        if (response.isInappropriate()) {
            throw new RuntimeException(response.getModeration_result());
        }

        User loggedUser = userRepository.findByEmail(userUtilityService.getLoggedUserName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> imageData = new HashMap<>();
        if (file != null && !file.isEmpty()) {
            try {
                ImageEntity image = imageService.uploadImage(file);
                imageData.put("id", image.getId());
                imageData.put("url", image.getImageUrl());
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed: " + e.getMessage());
            }
        }

        BlogEntries newBlogEntry = convertToEntity(blogRequest, loggedUser, imageData);
        blogRepository.save(newBlogEntry);

        loggedUser.getBlogEntries().add(newBlogEntry);
        userRepository.save(loggedUser);

        return convertToResponse(newBlogEntry);
    }

    @Override
    public BlogResponse updateBlog(String id, BlogEditRequest blogEditRequest) {
        PromptRequest promptRequest = new PromptRequest(blogEditRequest.getContent());
        ContentCheckResponse response = contentCheckerService.sendPrompt(promptRequest);

        if (response.isInappropriate()) {
            throw new RuntimeException(response.getModeration_result());
        }

        BlogEntries blog = blogRepository.findBlogById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setContent(blogEditRequest.getContent());
        blog.setTitle(blogEditRequest.getTitle());

        blogRepository.save(blog);

        return convertToResponse(blog);
    }

    @Override
    public List<ApiResponseBlogs> getAllBlogs() {
        String username = userUtilityService.getLoggedUserName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBlogEntries().stream()
                .map(this::convertToBlogResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBlog(String blogId) throws IOException {
        BlogEntries blogEntry = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

        if (!blogEntry.getImage().isEmpty()) {
            Map<String, String> blogImage = blogEntry.getImage();
            imageService.deleteImage(blogImage.get("id"));
        }

        blogRepository.delete(blogEntry);
    }

    private BlogEntries convertToEntity(BlogRequest request, User user, Map<String, String> imageData) {
        return BlogEntries.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .authorName(user.getFirstname() + " " + user.getLastname())
                .authorProfileImage(user.getProfileImage())
                .image(imageData)
                .isAiApproved(true)
                .status(BlogStatus.APPROVED)
                .createdDate(LocalDateTime.now())
                .build();
    }

    private BlogResponse convertToResponse(BlogEntries blogEntry) {
        return BlogResponse.builder()
                .id(blogEntry.getId())
                .title(blogEntry.getTitle())
                .content(blogEntry.getContent())
                .author(blogEntry.getAuthorName())
                .status(blogEntry.getStatus())
                .createdDate(blogEntry.getCreatedDate())
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
