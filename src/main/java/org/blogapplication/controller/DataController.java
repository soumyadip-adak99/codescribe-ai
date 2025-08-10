package org.blogapplication.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.blogapplication.dto.ApiResponseBlogs;
import org.blogapplication.dto.ApiResponseUser;
import org.blogapplication.services.Implementations.ApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/data")
@RequiredArgsConstructor
public class DataController {

    private final ApiService apiService;

    @GetMapping("/get-all/users")
    public ResponseEntity<List<ApiResponseUser>> getAllUsers() {
        return ResponseEntity.ok(apiService.getAllUsers());
    }

    @GetMapping("get-by/{id}")
    public ResponseEntity<ApiResponseUser> getUser(@PathVariable String id) {
        log.info(id);
        return ResponseEntity.ok(apiService.getUserById(id));
    }

    @GetMapping("/getAll/blogs")
    public ResponseEntity<List<ApiResponseBlogs>> getAllBlogs() {
        return ResponseEntity.ok(apiService.getAllBlogs());
    }
}
