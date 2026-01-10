package org.blogapplication.dto;

import lombok.Data;

@Data
public class BlogEditRequest {
    private String title;
    private String content;
}
