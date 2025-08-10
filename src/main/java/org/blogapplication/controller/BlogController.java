package org.blogapplication.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.dto.ApiResponseBlogs;
import org.blogapplication.dto.BlogEditRequest;
import org.blogapplication.dto.BlogRequest;
import org.blogapplication.dto.BlogResponse;
import org.blogapplication.services.BlogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping("/user/blogs")
    public ResponseEntity<List<ApiResponseBlogs>> getAllBlogs() {
        try {
            return ResponseEntity.ok(blogService.getAllBlogs());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponse> addNewBlog(@RequestPart("blog") BlogRequest requestContent,
                                                   @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            BlogResponse response = blogService.createBlog(requestContent, file);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            log.error("Runtime error while adding new blog: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Server error while adding new blog: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // TODO: change the functionality in feature add the change image function will be added
    @PutMapping("/edit/blog/{id}")
    public ResponseEntity<BlogResponse> editBlogById(@PathVariable String id, @RequestBody BlogEditRequest blogEditRequest) {
        try {
            return ResponseEntity.ok(blogService.updateBlog(id, blogEditRequest));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-blog/{blogId}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String blogId) {
        try {
            log.error(blogId);
            blogService.deleteBlog(blogId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            log.error("Runtime error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
