package org.blogapplication.services;


import org.blogapplication.dto.ApiResponseBlogs;
import org.blogapplication.dto.BlogEditRequest;
import org.blogapplication.dto.BlogRequest;
import org.blogapplication.dto.BlogResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlogService {

    BlogResponse createBlog(BlogRequest blogRequest, MultipartFile file);

    BlogResponse updateBlog(String id, BlogEditRequest blogEditRequest);

    List<ApiResponseBlogs> getAllBlogs();

    void deleteBlog(String id) throws IOException;
}
